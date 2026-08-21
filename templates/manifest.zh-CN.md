---
title: template.json 说明
description: 模板包清单字段
---

`template.json` 与其它集市包一样遵循 **`Package`** 元数据结构（字段含义见 [集市包总览](../bazaar/overview.zh-CN.md)）。

## 字段说明

与 [插件清单](../plugin/manifest.zh-CN.md) 相比：

- **不需要** `modes`（主题）、**不需要** `backends` / `frontends`（插件）。
- **需要** 通用字段：`name`、`author`、`url`、`version`、`displayName`、`description`、`readme`、`keywords` 等。

建议始终填写 **`minAppVersion`**，避免旧客户端加载新语法模板失败。

## 发布物

上架 zip 通常包含 **`template.json`、`icon.png`、`preview.png`、`README.md`** 以及模板 Markdown 文件本体；以集市校验为准。

## 相关接口

- `/api/template/render`：渲染并插入（参见 [模板包开发](./overview.zh-CN.md)）
- `/api/template/renderSprig`：与 Sprig 函数库相关的渲染（见 `API.md`）
