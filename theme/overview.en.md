---
title: Theme development overview
description: Theme package location, differences from plugins, and how themes load
---

SiYuan **themes** change how the app looks: colors, fonts, spacing, radius, mainly via **CSS** (optional scripts are discussed below). Themes do not change the notebook data model; for interactive logic and the **HTTP API**, build a **plugin**.

## Example theme layout

```text
appearance/themes/my-theme/
├── theme.json          # Required: manifest
├── theme.css           # Common style entry
├── theme.js            # Optional (listing rules depend on the marketplace)
├── preview.png         # Marketplace preview (needed for publishing)
├── icon.png
└── README.md
```

On disk:

**`{workspace}/appearance/themes/<theme-folder>/`**

Built-in **`daylight`** and **`midnight`** live alongside user themes in that tree.

---

## theme.json and picker lists

At startup SiYuan scans each theme subfolder for **`theme.json`** and groups themes into light or dark lists from **`modes`** (built-in `daylight` / `midnight` have special handling). Display names can come from multilingual **`displayName`** fields.

---

## Style entry

The usual filename is **`theme.css`** (built-in `daylight` and `midnight` use it). Variables are mostly prefixed **`--b3-`**; see [Styling and CSS variables](./styling).

---

## theme.js (optional)

Some themes historically shipped **`theme.js`**; the marketplace may reject scripts for new listings. **Prefer CSS variables for new themes**; scripts are a last resort.

---

## Working with plugins

Themes own the visual system: **CSS variables + `.b3-*` component classes**. When plugins inject DOM, read variables from **`getComputedStyle`** or reuse official classes instead of hard-coding one theme’s hex colors.

---

## Next steps

- [theme.json](./manifest)
- [Styling and CSS variables](./styling)
