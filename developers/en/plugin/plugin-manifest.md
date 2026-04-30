---
title: plugin.json reference
description: Plugin manifest fields and version constraints
order: 2
---

`plugin.json` describes plugin metadata, the entry script, and the minimum client version. Before release, verify that `name`, `author`, `url`, and `minAppVersion` match your README.

## Common fields (placeholder)

- **`minAppVersion`**: When the app is older, the client should refuse to enable the plugin or prompt to upgrade.
- **`main`**: Path to the bundled entry script.
- **Icons and i18n**: Add `readme` and per-language description fields as needed.

Later, link the official field list or JSON Schema from here.
