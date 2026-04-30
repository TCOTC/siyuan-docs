---
title: Plugin API basics
description: Talking to the kernel, commands, and settings — intro
order: 3
---

Plugins call kernel capabilities over HTTP / WebSocket and register commands, menus, and settings in `onload`. This page is a structural placeholder for wiring the sidebar and search.

## Suggested reading order

1. [Plugin development overview](./plugin-overview)
2. [plugin.json reference](./plugin-manifest)
3. Concrete API list (to be added)

## Notes

Error handling, retries, and `onunload` cleanup follow [Plugin development overview](./plugin-overview); avoid leaving duplicate listeners after hot reload.
