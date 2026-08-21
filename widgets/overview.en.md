---
title: Widget development
description: widget.json, static assets, and iframe embedding
---

**Widgets** embed in the editor document as an **`iframe`**. Sources are static files under **`{workspace}/data/widgets/<widget-name>/`**; SiYuan serves that folder at **`/widgets/`**.

## Workspace path

`{workspace}/data/widgets/<package-name>/`

## How the editor embeds

After picking a widget from the slash menu, the frontend calls **`hintRenderWidget`** (`app/src/protyle/hint/extend.ts`) and inserts markup similar to:

```html
<iframe src="/widgets/<package-name>/"
        data-subtype="widget"
        border="0" frameborder="no"
        framespacing="0" allowfullscreen="true"></iframe>
```

Note: `src` **ends with `/`**, per the path convention in Issue [#10520](https://github.com/siyuan-note/siyuan/issues/10520).

The widget folder should therefore expose a default document for static serving—usually **`index.html`** (depends on Gin static behavior for directory URLs). Verify locally in a browser or SiYuan preview.

## Widgets vs plugins

| | Widget | Plugin |
| --- | --- | --- |
| Entry | Static HTML/JS/CSS | `index.js`, extends `Plugin` |
| Runtime | Inside the iframe | Same origin as the main SiYuan UI |
| Strengths | Standalone UI, charts; cross-iframe messaging needs extra design | **HTTP API**, commands, Dock, deep editor integration |

Prefer **plugins** for deep editor and data integration; **widgets** for sandboxed standalone pages.

## Next steps

- [widget.json](./manifest.en.md)
