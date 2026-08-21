---
title: 发布与版本
description: package.zip、GitHub Release 与上架注意事项
---

本章描述几乎所有集市包**共通**的发布动作；各类包 zip 内文件清单仍以对应章节为准。

## 版本号

- 清单里的 **`version`**、Git **Tag**、Release 附件应对齐，便于用户与集市判断更新。
- 建议使用 [语义化版本](https://semver.org/)：`主版本.次版本.修订号`。

## 构建产物 package.zip

典型流程（与 [官方插件示例](https://github.com/siyuan-note/plugin-sample) 一致）：

1. 本地执行构建脚本（如 `pnpm run build`）。
2. 得到 **`package.zip`**，内含对应类型的清单、`README`、预览图等。

不同类别的检查项（是否存在 `plugin.json` / `theme.json` 等）在 CI 或集市侧可能有自动化校验；以官方仓库当前说明为准。

## GitHub Release

1. 打 Tag（通常与 `version` 一致）。
2. 创建 Release，上传 **`package.zip`** 作为附件。
3. 在 README 中写明最低思源版本（与 `minAppVersion` 一致）。

后续升级只需重复上述步骤；订阅 Release 的用户可收到更新通知。

## 集市索引与首次上架

社区集市通过索引聚合多个 GitHub 仓库；**索引格式与提交流程可能随重构而变化**。请你：

- 关注 [思源笔记](https://github.com/siyuan-note/siyuan) 与集市仓库的官方公告；
- 不要把第三方过时教程当作权威来源。

本文档**刻意不写死**某个 JSON 索引文件的字段或 PR 模板，避免与今后实现不一致。

## 资源体积与合规（概念）

集市 CI 对 **`icon.png`（≤ 20 KB）**、**`preview.png`（≤ 200 KB）** 有体积上限；主题可能对 **`theme.js`** 有新约束（例如新上架主题不得包含脚本）。发布前请阅读**当时**的集市校验规则或 Action 日志。

## 本地验证

在正式发布前，可将 zip 解压到工作空间对应目录（见 [集市包总览](./overview.zh-CN.md) 中的路径表），重启或刷新后手动验证，再发 Release。

## 相关链接

- 插件打包细节：[插件 · 打包与发布](../plugin/packaging.zh-CN.md)
- HTTP API 文档：[HTTP API 与数据规范](../plugin/http-api.zh-CN.md)
