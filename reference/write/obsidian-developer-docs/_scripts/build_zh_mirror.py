#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
zh 目录的正文应由 Cursor 子代理（或其它 LLM）对照 en 做 AI 翻译生成，而不是本仓库的机译脚本。

- 机译草稿（Google 等）：请运行 `python3 _scripts/build_zh_machine_mirror.py`
- 只把 en 里的图片 / CSS 等非 Markdown 同步到 zh：请运行 `python3 _scripts/sync_zh_assets_from_en.py`
"""

from __future__ import annotations

import sys


def main() -> None:
    print(__doc__.strip(), file=sys.stderr)
    sys.exit(2)


if __name__ == "__main__":
    main()
