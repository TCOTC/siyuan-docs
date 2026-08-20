---
title: widget.json 说明
description: 挂件包清单与发布物
---

`widget.json` 与其它集市包一致，使用 **`Package`** 元数据结构（与清单 JSON 字段一一对应，见开源仓库中类型定义）。

## 字段说明

填写 **`name`、`author`、`url`、`version`、`displayName`、`description`、`readme`、`keywords`、`minAppVersion`** 等通用字段即可；不需要 `modes` 或插件的环境字段。

## zip 内容

除清单外，挂件包需包含实际静态资源（至少能被 **`/widgets/<name>/`** 访问到的页面）。上架时通常还要求 **`icon.png`、`preview.png`、`README.md`**，以集市校验为准。

## 搜索与索引

在编辑器中搜索挂件时，客户端会读取各 **`widget.json`**，用于提示与筛选。

## 相关源码

- 挂件内容通过 **`/widgets/`** 路径提供静态访问（由本地 HTTP 服务挂载 `data/widgets`）。
- `app/src/protyle/hint/extend.ts`：`hintRenderWidget`
