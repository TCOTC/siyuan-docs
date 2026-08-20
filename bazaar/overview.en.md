---
title: Marketplace packages overview
description: Five package types, install paths, and shared metadata
order: 40
---

SiYuan’s **marketplace** distributes several kinds of **extension packages**. All share the same **`Package`** metadata (JSON maps to in-app structs—see the open-source repo), then install into different folders with different manifest filenames.

## Five package types

| Type | Manifest | Default install path (under workspace) | Typical use |
| --- | --- | --- | --- |
| **Plugin** | `plugin.json` | `data/plugins/<name>/` | Scripts for editor, commands, Dock, **HTTP API** |
| **Theme** | `theme.json` | `appearance/themes/<name>/` | `theme.css` and related styling |
| **Icon pack** | `icon.json` | `appearance/icons/<name>/` | Icon assets selectable in Settings |
| **Template** | `template.json` | `data/templates/<name>/` | Markdown / template snippets inserted into docs |
| **Widget** | `widget.json` | `data/widgets/<name>/` | Static HTML/JS/CSS pages in an iframe |

The table lists default locations; search the SiYuan repo for install logic if you need line-by-line behavior.

## Shared metadata (`Package`)

These fields are **common** across types (themes add `modes`; plugins add `backends`, `frontends`, etc.). Parsing and display apply HTML escaping to reduce XSS (`ParsePackageJSON` / `sanitizePackageDisplayStrings`).

| Field | Meaning |
| --- | --- |
| `name` | Package name; folder name usually matches |
| `author` | Author |
| `url` | Project home (often the GitHub repo) |
| `version` | Version; semver recommended |
| `minAppVersion` | Minimum SiYuan version |
| `displayName` | Localized display names; `default` required |
| `description` | Localized short description |
| `readme` | Map of language → README filename |
| `funding` | Sponsorship info |
| `keywords` | Marketplace search keywords |
| `disabledInPublish` | Disabled on publish service (plugins, etc.) |
| `backends` / `frontends` | **Plugin-only**: allowed backend/frontend environments |

Theme-only:

| Field | Meaning |
| --- | --- |
| `modes` | Array of `light` and/or `dark`; see [Theme manifest](../theme/theme-manifest) |

Plugin-only (excerpt; full table in [plugin.json](../plugin/plugin-manifest)):

| Field | Meaning |
| --- | --- |
| `backends` | `windows`, `linux`, `darwin`, `docker`, `android`, `ios`, `harmony`, `all` |
| `frontends` | `desktop`, `desktop-window`, `mobile`, `browser-desktop`, `browser-mobile`, `all` |
| `disabledInPublish` | Disabled in publish mode |

## Install and load (concept)

- After the user installs a package, the client downloads **`package.zip`** and extracts it to the path from the table above.
- The client reads the manifest JSON for compatibility; enabling a plugin uses **`/api/petal/loadPetals`** to fetch `index.js` and run it in the UI process.

## Relation to community marketplace indexes

Indexing and publishing may change; **do not** treat this page as the only listing guide. Expect a repo **Release**, a **`package.zip`** asset, valid manifest fields, and assets that meet size rules. See [Publishing and versions](./publishing).

## Next steps

- [Publishing and versions](./publishing)
- Per-type docs: [Plugins](../plugin/plugin-overview), [Themes](../theme/theme-overview), [Icon packs](../icons/overview), [Templates](../templates/overview), [Widgets](../widgets/overview)
