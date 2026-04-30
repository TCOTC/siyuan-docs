#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
将 en 中非 Markdown 文件复制到 zh 的相同相对路径（不覆盖已存在的 .md）。
用于 AI 翻译 Markdown 后补齐图片、favicon、CSS 等资源。
"""

from __future__ import annotations

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN = ROOT / "en"
ZH = ROOT / "zh"


def main() -> None:
    if not EN.is_dir():
        print(f"缺少 en 目录：{EN}", file=sys.stderr)
        sys.exit(1)
    ZH.mkdir(parents=True, exist_ok=True)
    n = 0
    for p in sorted(EN.rglob("*"), key=lambda x: str(x).lower()):
        if p.is_dir():
            continue
        if p.suffix.lower() == ".md":
            continue
        rel = p.relative_to(EN)
        dest = ZH / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(p, dest)
        n += 1
    print(f"已同步 {n} 个非 Markdown 文件到 {ZH}", flush=True)


if __name__ == "__main__":
    main()
