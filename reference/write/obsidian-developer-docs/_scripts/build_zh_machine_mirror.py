#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
机译（Google 等）生成 zh：非 Markdown 原样复制，Markdown 在保留 YAML 与代码块的前提下译为 zh-CN。

这不是「AI 子代理翻译」；正式中文稿应由模型逐篇翻译 en。仅在没有 AI 流程或需快速草稿时使用。
需安装：pip install deep-translator

用法：python3 _scripts/build_zh_machine_mirror.py
"""

from __future__ import annotations

import re
import shutil
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from deep_translator import GoogleTranslator
except ImportError:
    print("请先安装：pip install deep-translator", file=sys.stderr)
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
EN = ROOT / "en"
ZH = ROOT / "zh"

MAX_CHUNK = 4500
SLEEP_BETWEEN_CHUNKS = 0.06
SLEEP_BETWEEN_FILES = 0.02
RETRIES = 4
# 并行文件数过高易触发限流，可按网络情况调整
FILE_WORKERS = 6

_tls = threading.local()


def _translator() -> GoogleTranslator:
    if not hasattr(_tls, "translator"):
        _tls.translator = GoogleTranslator(source="en", target="zh-CN")
    return _tls.translator


def _translate_chunk(translator: GoogleTranslator, text: str) -> str:
    # 不得 strip：段首/段尾换行用于与围栏 ``` 或列表项分隔，去掉后会与上一段粘连。
    if not text or not text.strip():
        return text
    last_err: Exception | None = None
    for attempt in range(RETRIES):
        try:
            return translator.translate(text)
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"翻译失败（已重试 {RETRIES} 次）: {last_err}") from last_err


def take_first_chunk(segment: str, max_len: int) -> tuple[str, str]:
    if len(segment) <= max_len:
        return segment, ""
    end = max_len
    cut = segment.rfind("\n\n", 0, end)
    if cut <= 0:
        cut = segment.rfind("\n", 0, end)
    if cut <= 0:
        cut = end
    return segment[:cut], segment[cut:]


def translate_buffer(translator: GoogleTranslator, buf: str) -> str:
    out: list[str] = []
    rest = buf
    first = True
    while rest:
        if not first:
            time.sleep(SLEEP_BETWEEN_CHUNKS)
        first = False
        chunk, rest = take_first_chunk(rest, MAX_CHUNK)
        out.append(_translate_chunk(translator, chunk))
    return "".join(out)


CODE_FENCE_RE = re.compile(r"(```[\s\S]*?```)")

# Obsidian 维基链接：整段保留，避免翻译后破坏文件名。
WIKI_LINK_RE = re.compile(r"\[\[[^\]]*\]\]")

# 正文片段末尾、紧邻 ``` 围栏之前的换行与缩进；不送入翻译，避免 API 吃掉后与围栏粘连。
_TRAILING_BEFORE_FENCE_RE = re.compile(r"(\r?\n(?:\r?\n[ \t]*)*[ \t]*)\Z")

# 段首仅由换行与空白行组成的前缀（常见于上一围栏 ``` 之后）；不送入翻译。
_LEADING_MARGIN_RE = re.compile(r"\A((?:\r?\n[ \t]*)+)")

# Callout 标记（仅处理以 > 开头的引用行上的 `[!type]`），避免被译成无效类型名。
_CALLOUT_BRACKET_RE = re.compile(r"\[!([a-zA-Z][a-zA-Z0-9_-]*)\]")
_CALLOUT_LINE_PREFIX_RE = re.compile(r"[ \t]*>")


def _split_trailing_fence_prefix(text: str) -> tuple[str, str]:
    """剥离正文末尾紧邻下一围栏的空白，译后再拼回。"""
    m = _TRAILING_BEFORE_FENCE_RE.search(text)
    if not m:
        return text, ""
    trail = m.group(1)
    return text[: m.start()], trail


def _split_leading_margin(text: str) -> tuple[str, str]:
    """剥离段首用于与上一围栏 ``` 分隔的换行，译后再拼回。"""
    m = _LEADING_MARGIN_RE.match(text)
    if not m:
        return "", text
    return m.group(1), text[m.end() :]


def _protect_wiki_links(text: str) -> tuple[str, list[str]]:
    slots: list[str] = []

    def repl(_m: re.Match[str]) -> str:
        slots.append(_m.group(0))
        return f"<<<WIKI_LINK_{len(slots) - 1}>>>"

    return WIKI_LINK_RE.sub(repl, text), slots


def _restore_wiki_links(text: str, slots: list[str]) -> str:
    for i, raw in enumerate(slots):
        text = text.replace(f"<<<WIKI_LINK_{i}>>>", raw)
    return text


def _protect_callout_markers(text: str) -> tuple[str, list[str]]:
    """仅在引用行（行首可选空白后接 >）上保护 `[!xxx]`。"""
    slots: list[str] = []
    out_parts: list[str] = []
    for line in text.splitlines(keepends=True):
        if _CALLOUT_LINE_PREFIX_RE.match(line):

            def repl(m: re.Match[str]) -> str:
                slots.append(m.group(0))
                return f"<<<CALLOUT_{len(slots) - 1}>>>"

            line = _CALLOUT_BRACKET_RE.sub(repl, line)
        out_parts.append(line)
    return "".join(out_parts), slots


def _restore_callout_markers(text: str, slots: list[str]) -> str:
    for i, raw in enumerate(slots):
        text = text.replace(f"<<<CALLOUT_{i}>>>", raw)
    return text


def translate_text_segment(translator: GoogleTranslator, segment: str) -> str:
    """翻译单个围栏之间的正文段（剥离围栏前空白、占位符保护后分块请求）。"""
    if not segment:
        return segment
    lead, mid = _split_leading_margin(segment)
    core, trail = _split_trailing_fence_prefix(mid)
    t, wikis = _protect_wiki_links(core)
    t2, callouts = _protect_callout_markers(t)
    translated = translate_buffer(translator, t2)
    translated = _restore_callout_markers(translated, callouts)
    translated = _restore_wiki_links(translated, wikis)
    return lead + translated + trail


def translate_markdown_body(translator: GoogleTranslator, body: str) -> str:
    pieces = CODE_FENCE_RE.split(body)
    result: list[str] = []
    for piece in pieces:
        if piece.startswith("```"):
            result.append(piece)
        else:
            result.append(translate_text_segment(translator, piece))
    return "".join(result)


FRONTMATTER_RE = re.compile(r"\A---\r?\n([\s\S]*?)\r?\n---\r?\n", re.MULTILINE)


def process_markdown(translator: GoogleTranslator, raw: str) -> str:
    m = FRONTMATTER_RE.match(raw)
    if m:
        fm = raw[: m.end()]
        body = raw[m.end() :]
        return fm + translate_markdown_body(translator, body)
    return translate_markdown_body(translator, raw)


def translate_one_md(rel: Path) -> tuple[Path, Exception | None]:
    src = EN / rel
    dest = ZH / rel
    try:
        translator = _translator()
        raw = src.read_text(encoding="utf-8")
        zh_text = process_markdown(translator, raw)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(zh_text, encoding="utf-8")
        time.sleep(SLEEP_BETWEEN_FILES)
        return rel, None
    except Exception as e:
        return rel, e


def copy_non_md() -> None:
    for p in sorted(EN.rglob("*"), key=lambda x: str(x).lower()):
        if p.is_dir():
            continue
        if p.suffix.lower() == ".md":
            continue
        rel = p.relative_to(EN)
        dest = ZH / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dest)


def main() -> None:
    if not EN.is_dir():
        print(f"缺少 en 目录：{EN}", file=sys.stderr)
        sys.exit(1)

    if ZH.exists():
        shutil.rmtree(ZH)

    copy_non_md()
    print("已复制非 Markdown 资源。", flush=True)

    md_rels = sorted(
        (p.relative_to(EN) for p in EN.rglob("*.md")),
        key=lambda x: str(x).lower(),
    )
    total = len(md_rels)
    done = 0

    with ThreadPoolExecutor(max_workers=FILE_WORKERS) as ex:
        futures = {ex.submit(translate_one_md, rel): rel for rel in md_rels}
        for fut in as_completed(futures):
            rel, err = fut.result()
            if err is not None:
                print(f"[失败] {rel}: {err}", file=sys.stderr, flush=True)
                sys.exit(1)
            done += 1
            if done % 50 == 0 or done == total:
                print(f"Markdown 进度：{done}/{total}", flush=True)

    print(f"完成：zh 已写入 {ZH}", flush=True)


if __name__ == "__main__":
    main()
