---
title: Plugin development overview
description: Sample chapter for sidebar and layout
order: 1
---

Use this space for plugin lifecycle, the `plugin.json` entry point, and talking to the kernel. **Markdown is still rendered by Astro’s default engine**; swap the pipeline for Lute in production if you need parity.

### Code sample

```ts
export default class PluginSample {
	async onload() {
		console.log('Hello, SiYuan');
	}
}
```

Inline code like `plugin.json` uses the same thin-border style.

---

The following paragraphs only exist to lengthen the page for scroll and anchor testing; delete the whole block when you are done.

## 1. Where plugins run in SiYuan

SiYuan plugins run in the Electron renderer (desktop) or the equivalent WebView, talking to the local kernel via `fetch` / `WebSocket`. That helps debug “works in the browser, fails in the client”: same-origin rules, local ports, and permissions declared in `plugin.json` all affect real behavior.

A plugin usually includes: `plugin.json` (metadata and entry), `index.js` or the bundled main script, optional `icon.png`, and static assets. Prefer `pnpm` for dependencies, and in `onunload` unregister timers, listeners, and commands so hot reload or disable does not leave side effects.

## 2. Lifecycle and common hooks

- **`onload`**: Called when the plugin is enabled — register commands, toolbar buttons, settings, Protyle events, etc.
- **`onunload`**: Symmetric cleanup; skipping it often causes leaks or double registration.
- **`onLayoutReady`** (when available): Touch the DOM after layout is stable to reduce “element not mounted yet” races.

Long list for height: command registration, shortcut binding, block menu extensions, editor context menus, Dock panels, custom tabs, grouped settings, export hooks, pre-import validation, sync conflict UI… Document when each fires and what it returns so authors and tooling share expectations.

## 3. Interacting with the kernel API

Most kernel APIs are HTTP + JSON; some payloads are large or streamed. Keep request size reasonable, avoid hammering save while an IME composition is in progress, and backoff-retry on failures. If you need workspace paths, concatenate from API responses instead of assuming folder layout.

### 3.1 Error handling (illustrative)

Network jitter, kernel restarts, and laptop sleep can all fail requests. Surface understandable text in the UI and keep `status` / `message` in logs for bug reports. Never log tokens or passwords.

### 3.2 Version compatibility

Major SiYuan upgrades may change or deprecate API fields. Set `minAppVersion` in `plugin.json` truthfully and list tested version ranges in the README. Example checklist:

1. Run smoke tests on 3.x and 2.x if still supported.
2. Check whether `window.siyuan` or equivalent globals changed.
3. Check block attribute read/write key names.
4. Check whether theme CSS variables were renamed.
5. Check i18n keys against official language packs.

## 4. Developer experience

TypeScript and official or community typings reduce typos when building API paths. Do not ship uncompressed source maps in release builds unless you accept exposing internals. With Vite / Rollup, keep HMR in dev and tree-shake plus chunk splits for production.

A good overview should answer in five minutes: **where to start**, **what pitfalls to avoid**, and **where to read APIs**. Keep heading levels clear: H2 for big topics, H3 for subtopics; avoid jumping straight to H4 in the body or the TOC becomes noisy.

If you have reached this far, try the scrollbar a few times: sidebar highlight, sticky header, or “back to top” (if any) should feel right. If the wrong element scrolls, inspect `overflow`, `height: 100%`, and flex children with `min-height: 0`.

**Q: Can a plugin replace the kernel?** Usually not; plugins extend via public APIs.

**Q: Do plugins conflict?** Yes — two items on the same menu or the same shortcut need coordination.

**Q: How to debug?** Open dev tools in SiYuan and set breakpoints in plugin scripts; production builds may strip debug symbols.

**Q: Can I publish to the marketplace?** Depends on channel policy and this repo’s notes; not expanded here.

## 5. Appendix: placeholder A–J (abbreviated)

Paragraphs A–J in the Chinese original only add scroll height. For English, this appendix is shortened on purpose: in real docs, alternate block quotes, lists, tasks, code blocks, and tables; mix CJK and Latin spacing (e.g. `SiYuan API`); avoid mega-long single-line URLs; lazy-load images; use KaTeX pages to test math height; keep footnotes at the end; verify TOC sync on long pages; test mobile drawer scrolling separately.

## 6. Closing

Replace everything from “The following paragraphs only exist…” onward with real API text, screenshots, and minimal repros when you are ready.
