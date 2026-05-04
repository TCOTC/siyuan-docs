---
title: Icon pack development
description: icon.json, directory layout, and when to use icon packs
order: 60
---

An **icon pack** bundles icon assets under a fixed folder and describes them with **`icon.json`**. Users pick it in SiYuan appearance settings alongside built-in sets.

## Workspace path

`{workspace}/appearance/icons/<package-name>/`

Like themes, icon packs live under `appearance`, not `data`. SiYuan scans subfolders, parses `icon.json`, and exposes selectable icon schemes in Settings.

## Manifest: icon.json

Built-in example: `app/appearance/icons/litheness/icon.json`:

```json
{
  "name": "litheness",
  "author": "Vanessa",
  "url": "https://github.com/Vanessa219",
  "version": "1.0.0"
}
```

This matches the shared `Package` shape; you can add **`minAppVersion`**, **`displayName`**, **`description`**, **`readme`**, **`funding`**, **`keywords`**, etc., for marketplace display and search (see [Marketplace packages overview](../bazaar/overview)).

There are **no** `modes` / `backends` / `frontends` fields for themes or plugins.

## Typical package contents

Besides `icon.json`, actual icon files (format and naming) should follow built-in packs or official samples. Published zips usually also need **`icon.png`**, **`preview.png`**, **`README.md`**, etc.—follow current marketplace checks.

## Icon packs vs emojis in notes

Changing the “icon scheme” in Settings is an appearance setting. If you only want to insert emojis into note content, that may be a different feature (`data/emojis`, etc.) and not the same mechanism—confirm product requirements before you build.

## Next steps

- [icon.json field reference](./manifest)
