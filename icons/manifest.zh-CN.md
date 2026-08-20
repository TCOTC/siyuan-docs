---
title: icon.json 说明
description: 图标包清单与集市字段
---

`icon.json` 与 [集市包总览](../bazaar/overview) 中的通用 `Package` 字段一致。

## 常用字段

| 字段 | 说明 |
| --- | --- |
| `name` | 包名，通常与目录名、仓库名一致 |
| `author` | 作者 |
| `url` | 项目地址 |
| `version` | 版本号 |
| `minAppVersion` | 最低思源版本（建议填写） |
| `displayName` | 多语言显示名称，需含 `default` |
| `description` | 多语言短描述 |
| `readme` | 各语言 README 文件名 |
| `funding` | 赞助信息 |
| `keywords` | 搜索关键词 |

## 发布物

发版 zip 中需包含清单与资源文件；具体必含文件列表以集市检查规则为准（通常含 **`icon.png`、`preview.png`、`README.md`** 等）。

## 相关源码

- 解析与展示逻辑见主程序源码中「外观 / 图标」相关部分
- `Package` 元数据与 [集市包总览](../bazaar/overview) 一致
