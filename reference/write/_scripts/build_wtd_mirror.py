#!/usr/bin/env python3
"""
Download Write the Docs guide sources, convert to Markdown, emit under reference/write/en/.
Run from repo root: python3 reference/write/_scripts/build_wtd_mirror.py
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
OUT_EN = REPO_ROOT / "reference" / "write" / "en"
SRC = Path("/tmp/wtd-src")

RAW = "https://raw.githubusercontent.com/writethedocs/www/main"

# (relative path under OUT_EN, filename, github path, source_url path on writethedocs.org)
# source_url path is without domain, leading slash optional
FILES_RST = [
    (
        "how-to-start-writing-technical-documentation",
        "beginners-guide-to-docs.md",
        "docs/guide/writing/beginners-guide-to-docs.rst",
        "/writing/beginners-guide-to-docs/",
    ),
    (
        "how-to-start-writing-technical-documentation",
        "starting.md",
        "docs/guide/starting.rst",
        "/starting/",
    ),
    (
        "how-to-start-writing-technical-documentation",
        "mindshare.md",
        "docs/guide/writing/mindshare.rst",
        "/writing/mindshare/",
    ),
    (
        "how-to-start-writing-technical-documentation",
        "docs-principles.md",
        "docs/guide/writing/docs-principles.rst",
        "/writing/docs-principles/",
    ),
    (
        "how-to-start-writing-technical-documentation",
        "imposter.md",
        "docs/guide/imposter.rst",
        "/imposter/",
    ),
    (
        "resources-for-creating-documentation",
        "support-team.md",
        "docs/guide/writing/support-team.rst",
        "/writing/support-team/",
    ),
    (
        "resources-for-creating-documentation",
        "ux-writing.md",
        "docs/guide/ux-writing.rst",
        "/ux-writing/",
    ),
    (
        "approaches-to-creating-documentation",
        "docs-as-code.md",
        "docs/guide/docs-as-code.rst",
        "/docs-as-code/",
    ),
    (
        "approaches-to-creating-documentation",
        "doc-ops.md",
        "docs/guide/doc-ops.rst",
        "/doc-ops/",
    ),
    (
        "understanding-markup-languages",
        "reStructuredText.md",
        "docs/guide/writing/reStructuredText.rst",
        "/writing/reStructuredText/",
    ),
    (
        "understanding-markup-languages",
        "xml.md",
        "docs/guide/writing/xml.rst",
        "/writing/xml/",
    ),
    (
        "understanding-markup-languages",
        "asciidoc.md",
        "docs/guide/writing/asciidoc.rst",
        "/writing/asciidoc/",
    ),
    (
        "documentation-tools",
        "choosing-tools.md",
        "docs/guide/choosing-tools.rst",
        "/choosing-tools/",
    ),
    (
        "documentation-tools",
        "seo.md",
        "docs/guide/seo.rst",
        "/seo/",
    ),
    (
        "how-to-write-api-documentation",
        "api-documentation-tools.md",
        "docs/guide/api/api-documentation-tools.rst",
        "/api/api-documentation-tools/",
    ),
    (
        "contributing-to-write-the-docs",
        "index.md",
        "docs/guide/about/index.rst",
        "/about/",
    ),
    (
        "contributing-to-write-the-docs",
        "vision.md",
        "docs/guide/about/vision.rst",
        "/about/vision/",
    ),
    (
        "contributing-to-write-the-docs",
        "alternatives.md",
        "docs/guide/about/alternatives.rst",
        "/about/alternatives/",
    ),
    (
        "contributing-to-write-the-docs",
        "community.md",
        "docs/guide/about/community.rst",
        "/about/community/",
    ),
    (
        "contributing-to-write-the-docs",
        "contributing.md",
        "docs/guide/contributing.rst",
        "/contributing/",
    ),
    (
        "write-the-docs-resources",
        "slack.md",
        "docs/slack.rst",
        "/slack/",
    ),
]

FILES_MD = [
    (
        "resources-for-creating-documentation",
        "style-guides.md",
        "docs/guide/writing/style-guides.md",
        "/writing/style-guides/",
    ),
    (
        "resources-for-creating-documentation",
        "accessibility.md",
        "docs/guide/writing/accessibility.md",
        "/writing/accessibility/",
    ),
    (
        "resources-for-creating-documentation",
        "reducing-bias.md",
        "docs/guide/writing/reducing-bias.md",
        "/writing/reducing-bias/",
    ),
    (
        "understanding-markup-languages",
        "markdown.md",
        "docs/guide/writing/markdown.md",
        "/writing/markdown/",
    ),
]

# Normalized site path (no leading/trailing slash, lower) -> (subdir, filename)
URL_TO_REL: dict[str, tuple[str, str]] = {}
for subdir, name, _, url in FILES_RST + FILES_MD:
    key = url.strip("/").lower()
    # reStructuredText URL uses mixed case path on site
    URL_TO_REL[key] = (subdir, name)
# Aliases
URL_TO_REL["writing/restructuredtext"] = (
    "understanding-markup-languages",
    "reStructuredText.md",
)
URL_TO_REL["guide"] = ("", "software-documentation-guide.md")
URL_TO_REL["guide/index"] = ("", "software-documentation-guide.md")
URL_TO_REL["tools"] = ("documentation-tools", "tools.md")
URL_TO_REL["slack"] = ("write-the-docs-resources", "slack.md")


def frontmatter(source_file: str, source_url_path: str) -> str:
    canon = "https://www.writethedocs.org" + (
        source_url_path if source_url_path.startswith("/") else "/" + source_url_path
    )
    return (
        "---\n"
        f"source_url: {canon}\n"
        f"source_file: {source_file}\n"
        "license: CC BY-NC-SA 4.0\n"
        "---\n\n"
    )


def pandoc_rst(path: Path, shift: int = 0) -> str:
    cmd = [
        "pandoc",
        str(path),
        "-f",
        "rst",
        "-t",
        "gfm",
        "--wrap=none",
    ]
    if shift:
        cmd.append(f"--shift-heading-level-by={shift}")
    return subprocess.check_output(cmd, text=True)


def pandoc_md(path: Path) -> str:
    # Already markdown; pass through pandoc for normalization / gfm
    return subprocess.check_output(
        ["pandoc", str(path), "-f", "markdown", "-t", "gfm", "--wrap=none"],
        text=True,
    )


def rel_link(from_dir: Path, target_subdir: str, target_file: str) -> str:
    """Compute relative POSIX path from from_dir to target file under OUT_EN."""
    dest = OUT_EN / target_subdir / target_file if target_subdir else OUT_EN / target_file
    return Path(os.path.relpath(dest, from_dir)).as_posix()


def rewrite_links(body: str, current_subdir: str, current_file: str) -> str:
    from_dir = OUT_EN / current_subdir if current_subdir else OUT_EN

    def repl(m: re.Match[str]) -> str:
        url = m.group(1)
        frag = m.group(2) or ""

        if url.startswith("https://www.writethedocs.org"):
            base = "https://www.writethedocs.org"
        elif url.startswith("http://www.writethedocs.org"):
            base = "http://www.writethedocs.org"
        else:
            return m.group(0)
        path_part = url[len(base) :].split("?", 1)[0]
        if path_part.startswith("/"):
            path_part = path_part[1:]
        norm = path_part.rstrip("/").lower()
        if norm not in URL_TO_REL and "/" in norm:
            # try first segment combos
            pass
        if norm not in URL_TO_REL:
            # e.g. guide/writing/... 
            for prefix in ("guide/", ""):
                trial = norm[len(prefix) :] if norm.startswith(prefix) else norm
                if trial in URL_TO_REL:
                    norm = trial
                    break
        # about pages
        if norm == "about":
            norm = "about"
        pair = URL_TO_REL.get(norm)
        if not pair:
            return m.group(0)
        t_sub, t_name = pair
        if t_name == "software-documentation-guide.md":
            rp = rel_link(from_dir, "", "software-documentation-guide.md")
        else:
            rp = rel_link(from_dir, t_sub, t_name)
        return f"]({rp}{frag})"

    return re.sub(
        r"\]\((https?://www\.writethedocs\.org[^)\s#]*)(#[^)\s]*)?\)",
        repl,
        body,
    )


def strip_toctree_divs(s: str) -> str:
    s = re.sub(
        r"<div class=\"toctree\"[^>]*>.*?</div>\s*",
        "",
        s,
        flags=re.DOTALL,
    )
    return s


def build_tools_md() -> str:
    intro = """# Tools for documentation writing

Writing documentation requires good tools. This section covers documentation tools recommended by the Write the Docs community, with a focus on tools widely used for technical documentation.

## Sphinx

Sphinx is a documentation generator widely used in the Python ecosystem and beyond. It converts reStructuredText (and Markdown via MyST Parser) into HTML, PDF, and other formats. Sphinx excels at technical documentation with features like code introspection, cross-referencing, and multiple output formats.

The following subsections consolidate upstream Sphinx guide pages.

"""
    parts = [frontmatter("docs/guide/tools/index.rst", "/tools/"), intro]
    for name, shift in (
        ("sphinx.rst", 1),
        ("sphinx-themes.rst", 1),
        ("sphinx-community.rst", 1),
    ):
        p = SRC / "docs/guide/tools" / name
        parts.append(pandoc_rst(p, shift=shift))
        parts.append("\n\n")
    parts.append(
        """## Other documentation tools

While this section currently focuses on Sphinx, the Write the Docs community uses many documentation tools depending on project needs:

- **MkDocs**: Markdown-focused static site generator with live preview
- **Docusaurus**: React-based tool by Meta with built-in versioning and i18n
- **Jekyll**: Ruby-based static site generator, popular for GitHub Pages
- **Hugo**: Extremely fast Go-based generator for content sites

See the main [Software documentation guide](../software-documentation-guide.md) for broader documentation guidance applicable across tools.

## Testing and quality

"""
    )
    parts.append(pandoc_rst(SRC / "docs/guide/tools/testing.rst", shift=1))
    body = "".join(parts)
    body = strip_toctree_divs(body)
    # Fix odd :doc: leftovers
    body = body.replace("See the main `/guide/index`", "See the main guide index")
    return body


def main() -> None:
    if not SRC.is_dir():
        print("Missing /tmp/wtd-src; curl sources first", file=sys.stderr)
        sys.exit(1)

    for subdir, name, gh, url in FILES_RST:
        out_dir = OUT_EN / subdir
        out_dir.mkdir(parents=True, exist_ok=True)
        src_path = SRC / gh
        text = pandoc_rst(src_path)
        if gh == "docs/guide/about/index.rst":
            text = strip_toctree_divs(text)
            text = re.sub(
                r"(Here is information about the Write the Docs project itself\.)\s*\n*",
                r"\1\n\n"
                r"- [Vision](vision.md)\n"
                r"- [Interesting approaches to documentation](alternatives.md)\n"
                r"- [Documentation community](community.md)\n\n",
                text,
                count=1,
            )
        text = frontmatter(gh, url) + text
        text = rewrite_links(text, subdir, name)
        (out_dir / name).write_text(text, encoding="utf-8")

    for subdir, name, gh, url in FILES_MD:
        out_dir = OUT_EN / subdir
        out_dir.mkdir(parents=True, exist_ok=True)
        text = pandoc_md(SRC / gh)
        text = frontmatter(gh, url) + text
        text = rewrite_links(text, subdir, name)
        (out_dir / name).write_text(text, encoding="utf-8")

    # documentation-tools/tools.md
    out_dir = OUT_EN / "documentation-tools"
    out_dir.mkdir(parents=True, exist_ok=True)
    tools_body = build_tools_md()
    tools_body = rewrite_links(tools_body, "documentation-tools", "tools.md")
    (out_dir / "tools.md").write_text(tools_body, encoding="utf-8")

    # Second pass: resolve cross-links now that all files exist
    for md in OUT_EN.rglob("*.md"):
        rel = md.relative_to(OUT_EN)
        sub = rel.parent.as_posix() if rel.parent != Path(".") else ""
        text = md.read_text(encoding="utf-8")
        new = rewrite_links(text, sub, rel.name)
        if new != text:
            md.write_text(new, encoding="utf-8")

    print("Wrote EN mirror under", OUT_EN)


if __name__ == "__main__":
    main()
