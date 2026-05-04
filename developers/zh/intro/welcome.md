---
title: 开发者文档
description: 面向思源笔记插件、集市包与主题作者的完整入口
order: 0
---

本手册面向需要为**思源笔记**开发**插件、主题、图标包、模板包、挂件**，或需要查阅**本地 HTTP API**（见官方仓库 `API.md`）的开发者。行文上遵循清晰标题、表格化字段说明、可运行的代码示例（可参考本站摘录的技术写作原则：`reference/write/software-documentation-guide/`）。

内容依据：**思源笔记开源仓库**、**官方 plugin-sample**；集市索引与上架流程若变更，以官方公告为准。

---

## 文档地图

### 入门

| 页面 | 说明 |
| --- | --- |
| [如何阅读与贡献本文档](./docs-style) | 写作约定与章节结构 |
| [集市包总览](../bazaar/overview) | **五类**集市包、路径、通用 `Package` 字段 |
| [发布与版本](../bazaar/publishing) | `package.zip`、GitHub Release、上架注意 |

### 插件（Petal）

| 页面 | 说明 |
| --- | --- |
| [插件开发概览](../plugin/plugin-overview) | 运行环境、`index.js` 加载链、生命周期 |
| [快速上手](../plugin/plugin-quickstart) | 模板仓库、`pnpm`、本地调试 |
| [plugin.json](../plugin/plugin-manifest) | 清单与环境字段 |
| [前端 Plugin API](../plugin/plugin-frontend-api) | `Plugin` 类、命令、Dock、存储、`fetchPost` |
| [HTTP API 与数据规范](../plugin/plugin-http-api) | HTTP、鉴权、`/api/file/*`、日记属性 |
| [调试与排错](../plugin/plugin-debugging) | 控制台、常见报错 |
| [事件参考](../plugin/plugin-events) | **`TEventBus`** 事件表 |
| [打包与发布](../plugin/plugin-packaging) | zip、Release |

### 主题

| 页面 | 说明 |
| --- | --- |
| [主题概览](../theme/theme-overview) | `appearance/themes`、与插件区别 |
| [theme.json](../theme/theme-manifest) | `modes`、清单字段 |
| [样式与 CSS 变量](../theme/theme-styling) | `--b3-*` 变量与定制步骤 |

### 图标包 · 模板 · 挂件

| 页面 | 说明 |
| --- | --- |
| [图标包](../icons/overview) | `appearance/icons`、`icon.json` |
| [模板包](../templates/overview) | `data/templates`、`/api/template/render` |
| [模板语法](../templates/authoring) | `.action{}` Go 模板 |
| [挂件](../widgets/overview) | `data/widgets`、`/widgets/` iframe |

---

## 官方仓库速查

| 资源 | 链接 |
| --- | --- |
| 思源主程序源码 | [github.com/siyuan-note/siyuan](https://github.com/siyuan-note/siyuan) |
| HTTP API 手册 | [API_zh_CN.md](https://github.com/siyuan-note/siyuan/blob/master/API_zh_CN.md) |
| 官方插件示例 | [github.com/siyuan-note/plugin-sample](https://github.com/siyuan-note/plugin-sample) |
| npm `siyuan`（类型与导出） | 版本需与目标思源匹配，见示例工程 `package.json` |

---

## 源码锚点（调试时常用）

下列路径均在思源主仓库内，便于你对照行为：

| 主题 | 路径 |
| --- | --- |
| `Plugin` 基类 | `app/src/plugin/index.ts` |
| 插件加载 | `app/src/plugin/loader.ts` |
| 集市包元数据模型 | `Package` 结构（Go 侧与清单 JSON 对应，见开源仓库） |

---

## 英文版

中文版稳定后，将翻译并维护 `developers/en/`，目录与本站导航对齐。
