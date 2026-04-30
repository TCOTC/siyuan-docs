---
title: 插件 API 基础
description: 与内核通信、命令与设置项的入门说明
order: 3
---

插件通过 HTTP / WebSocket 等通道调用内核能力，并在 `onload` 中注册命令、菜单与设置。本文档为结构占位，便于侧栏与搜索联调。

## 建议阅读顺序

1. [插件开发概览](./plugin-overview)
2. [plugin.json 说明](./plugin-manifest)
3. 具体 API 列表（待补充）

## 注意点

错误处理、重试与 `onunload` 清理与 [插件开发概览](./plugin-overview) 中的说明一致，实现时勿在热重载后留下重复监听。
