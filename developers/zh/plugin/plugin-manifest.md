---
title: plugin.json 说明
description: 插件清单字段与版本约束
order: 2
---

`plugin.json` 描述插件元数据、入口脚本与最低客户端版本。正式发布前应核对 `name`、`author`、`url` 与 `minAppVersion` 等字段是否与 README 一致。

## 常用字段（占位）

- **`minAppVersion`**：不满足版本时客户端应拒绝启用或提示升级。
- **`main`**：打包后的入口脚本路径。
- **图标与多语言**：按需补充 `readme` 与各语言描述字段。

后续可在此处链接官方字段说明或 JSON Schema。
