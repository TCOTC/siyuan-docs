---
title: Plugin development overview
description: Plugin runtime, load chain, and lifecycle
order: 20
---

SiYuan **plugins** are also called **Petals**: JavaScript running in the **SiYuan client UI process**, talking to the **local HTTP API** via **`fetchPost`** and similar APIs to extend the editor, commands, and UI.

---

## Architecture (logical)

```text
┌─────────────────────────────────────────────────────────┐
│ SiYuan client (Electron / browser / mobile WebView)     │
│  ┌─────────────┐    fetchPost / WebSocket    ┌──────────┐ │
│  │ Plugin index.js │ ───────────────────────► │ HTTP API │ │
│  │ extends Plugin  │                          │ :6806    │ │
│  └─────────────┘                              └──────────┘ │
└─────────────────────────────────────────────────────────┘
         │ Notebook data and attachments must go through this API
         ▼
   {workspace}/data/...
```

Plugins are **not** arbitrary background scripts with full disk access; do **not** use **`require('fs')`** to edit raw files under the notebook tree—use the interfaces documented in **`API.md`**.

---

## Directory layout

Enabled plugins live at:

**`{workspace}/data/plugins/<package-name>/`**

SiYuan reads fixed filenames from the package:

| File | Required | Notes |
| --- | --- | --- |
| **`index.js`** | Yes | Bundled output (webpack, esbuild, etc.); injected and executed in the frontend |
| **`index.css`** | No | Injected when present |
| **`plugin.json`** | Strongly recommended | Local and marketplace metadata, compatibility checks |
| **`i18n/*.json`** | No | Plugin UI strings |

The entry file is **always `index.js`**; there is **no** `main` field in `plugin.json`.

---

## Load chain (simplified)

1. The client calls **`/api/petal/loadPetals`** and receives **`js` / `css` / `i18n`** for enabled plugins.
2. **`loader.ts`** wraps the script with **`eval`**, runs it, and reads **`export default`**.
3. `new PluginSubclass({ app, name, displayName, i18n })`, then **`await onload()`**.

Errors at any step surface in the console as **`plugin <name> run error`** or **`onload error`**.

---

## Lifecycle hooks

| Method | When it runs |
| --- | --- |
| **`onload`** | Right after the plugin is enabled; register commands, menus, `eventBus`, Dock, etc. |
| **`onunload`** | Before disable; **must** remove listeners, timers, and DOM |
| **`onLayoutReady`** | After the main layout is ready |
| **`onDataChanged`** | Plugin storage sync changes (see source comments, multi-device sync) |
| **`uninstall`** | Override when uninstall flow needs custom behavior |

There are also optional overrides such as **`updateProtyleToolbar`**, **`updateCards`**, and more.

---

## How plugins relate to other marketplace packages

| Type | When to use a plugin |
| --- | --- |
| Theme | Skin only, CSS variables → use a **theme** |
| Template | Insert snippets only → **template pack** |
| Widget | Standalone iframe page → **widget** |
| Icon pack | Swap emoji / icon set → **icon pack** |
| Plugin | Commands, HTTP API, editor behavior → **plugin** |

---

## Compatibility and trust

- **`minAppVersion`**: SiYuan below this version should not enable the plugin.
- **`backends` / `frontends`**: Mismatch with the current environment may skip loading.
- **Marketplace trust**: Some setups require the user to trust the marketplace before the plugin list loads (depends on client settings).

---

## Next steps

1. [Quick start](./plugin-quickstart)
2. [plugin.json](./plugin-manifest)
3. [Frontend Plugin API](./plugin-frontend-api)
