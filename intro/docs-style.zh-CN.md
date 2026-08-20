---
title: 如何阅读与贡献本文档
description: 技术写作原则与本仓库文档约定
order: 1
---

思源开发者文档面向「要能动手做出集市包、插件与主题」的读者，写法上对齐业界常见的技术文档实践（可参考本站 `reference/write/software-documentation-guide/` 下摘录的 [Docs principles](https://www.writethedocs.org/guide/writing/docs-principles/) 等资料）。

## 写作原则（摘要）

- **先说明目标再展开细节**：每一章开头用一两段交代适用场景与前置知识。
- **可扫读**：标题信息性强；列表与表格承载结构化内容；避免把关键步骤埋在长段落里。
- **示例与参考并存**：教程类段落给「最小可运行」示例；API 类段落给字段表并指向源码或 `API.md`。
- **承认版本差异**：思源与 **HTTP API** 会演进，涉及行为差异处请写明「以某版本起」或「见官方 `API.md` / 源码」。
- **中英混排**：中文与英文、数字之间留空格（与本仓库代码注释规范一致）。

## 本文档的结构

- **入门**：导航与官方仓库索引。
- **插件**：从清单、构建、前端 `Plugin` API 到 **HTTP** 接口。
- **主题**：`theme.json`、`theme.css` 与 CSS 变量。
- **集市与发布**：五类集市包共通的 `Package` 元数据、清单文件、安装路径与发布物。
- **图标包 / 模板 / 挂件**：各类包独有的清单与使用方式。

## 引用思源源码时的建议

优先给出 **GitHub 上的永久路径**（含分支或标签说明），例如：

- `app/src/plugin/index.ts`：`Plugin` 基类。
- `app/src/plugin/loader.ts`：插件脚本如何注入与执行。

需要对照清单在磁盘上的落盘规则时，可在主仓库中搜索与 **集市包**、**`data/plugins`** 相关的实现，而不必在本文档中展开内部分层。

## 术语：清单与元数据

集市包文档统一采用分层说法，避免把 `plugin.json` 等文件笼统称为「元数据」：

| 概念 | 说法 | 示例 |
| --- | --- | --- |
| 按类型的 JSON 文件 | **清单文件** / **清单** / **清单 JSON** | `plugin.json`、`theme.json` |
| 文件里的键 | **清单字段** | `name`、`version`、`readme` |
| 跨类型共用的字段模型 | **`Package` 元数据** | Go 侧 `Package` 结构、集市总览字段表 |

推荐句式：「检查 zip 内的**清单文件** `plugin.json`」「`name` 是 **`Package` 元数据**的必填**清单字段**」。

## 与 Obsidian 文档的类比

Obsidian 开发者文档（本站 `reference/write/obsidian-developer-docs/`）习惯把「插件解剖」「发布流程」「事件」分章。思源插件模型不同（基于 **HTTP API** + `Plugin` 类 + Petal 加载），但**分层的思路可借鉴**：入门 → 清单 → 运行时 API → 调试与发布。
