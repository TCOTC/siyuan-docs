---
title: Developer documentation
description: Entry point for SiYuan plugin, marketplace package, and theme authors
order: 0
---

This handbook is for developers who extend **SiYuan** with **plugins, themes, icon packs, template packs, or widgets**, or who need the **local HTTP API** (see the official repo `API.md`). Pages use clear headings, tabular field descriptions, and runnable examples where possible (see the technical writing excerpts under `reference/write/software-documentation-guide/` on this site).

Sources: the **SiYuan open-source repo** and the **official plugin-sample**; if marketplace indexing or publishing changes, follow official announcements.

---

## Doc map

### Introduction

| Page | Description |
| --- | --- |
| [How to read and contribute](./docs-style) | Conventions and chapter structure |
| [Marketplace packages overview](../bazaar/overview) | **Five** package types, paths, shared `Package` fields |
| [Publishing and versions](../bazaar/publishing) | `package.zip`, GitHub Release, listing notes |

### Plugins (Petal)

| Page | Description |
| --- | --- |
| [Plugin development overview](../plugin/plugin-overview) | Runtime, `index.js` load chain, lifecycle |
| [Quick start](../plugin/plugin-quickstart) | Template repo, `pnpm`, local debugging |
| [plugin.json](../plugin/plugin-manifest) | Manifest and environment fields |
| [Frontend Plugin API](../plugin/plugin-frontend-api) | `Plugin` class, commands, Dock, storage, `fetchPost` |
| [HTTP API and data rules](../plugin/plugin-http-api) | HTTP, auth, `/api/file/*`, daily note attributes |
| [Debugging](../plugin/plugin-debugging) | Console, common errors |
| [Events reference](../plugin/plugin-events) | **`TEventBus`** event tables |
| [Packaging and publishing](../plugin/plugin-packaging) | zip, Release |

### Themes

| Page | Description |
| --- | --- |
| [Theme overview](../theme/theme-overview) | `appearance/themes`, vs plugins |
| [theme.json](../theme/theme-manifest) | `modes`, manifest fields |
| [Styling and CSS variables](../theme/theme-styling) | `--b3-*` variables and customization |

### Icon packs · Templates · Widgets

| Page | Description |
| --- | --- |
| [Icon packs](../icons/overview) | `appearance/icons`, `icon.json` |
| [Template packs](../templates/overview) | `data/templates`, `/api/template/render` |
| [Template syntax](../templates/authoring) | `.action{}` Go templates |
| [Widgets](../widgets/overview) | `data/widgets`, `/widgets/` iframe |

---

## Official repos quick reference

| Resource | Link |
| --- | --- |
| SiYuan main app source | [github.com/siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) |
| HTTP API manual | [API.md](https://github.com/siyuan-note/siyuan/blob/master/API.md) · [API_zh_CN.md](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) |
| Official plugin sample | [github.com/siyuan-note/plugin-sample](https://github.com/siyuan-note/plugin-sample) |
| npm `siyuan` (types and exports) | Match the SiYuan version you target; see the sample `package.json` |

---

## Source anchors (handy when debugging)

Paths below are in the main SiYuan repo:

| Topic | Path |
| --- | --- |
| `Plugin` base class | `app/src/plugin/index.ts` |
| Plugin loading | `app/src/plugin/loader.ts` |
| Marketplace `Package` model | Go structs aligned with manifest JSON (see the open-source repo) |

---

## Other languages

Chinese pages live under `developers/zh/` with the same navigation layout as this tree.
