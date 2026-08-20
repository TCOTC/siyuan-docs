---
title: 打包与发布
description: package.zip 内容、GitHub Release 与上架检查清单
---

## 1. 构建命令

在插件仓库根目录：

```bash
pnpm run build
```

官方示例使用 **webpack** 生成 **`index.js`**、**`index.css`** 并打 **`package.zip`**（细节以 [plugin-sample](https://github.com/siyuan-note/plugin-sample) 的 `webpack` 配置为准）。

---

## 2. zip 内建议包含的文件

与示例 README 对齐时，至少包括：

| 文件 / 目录 | 说明 |
| --- | --- |
| **`plugin.json`** | 清单字段与兼容性（`Package` 元数据） |
| **`index.js`** | 打包入口（必需） |
| **`index.css`** | 样式；无样式时是否仍需空文件取决于构建脚本 |
| **`i18n/*.json`** | 若插件声明多语言界面 |
| **`icon.png`** | 建议约 **160×160**，体积须 **≤ 20 KB**（集市 CI 校验） |
| **`preview.png`** | 建议约 **1024×768**，体积须 **≤ 200 KB**（集市 CI 校验） |
| **`README.md`** / **`README_zh_CN.md`** | 详情页说明；语言映射写在 `plugin.json` 的 **`readme`** |

不要把 **`node_modules`**、**源码 `.ts`**、未处理的 **`src/`** 打进 zip（除非你有意开源完整源码包——那是另一类分发方式）。

---

## 3. GitHub Release 流程

1. 更新 **`plugin.json`** 中的 **`version`**（与 git tag 对齐）。
2. 提交并推送代码。
3. 在 GitHub 上创建 **Tag**（例如 `v0.5.0`），新建 **Release**。
4. 上传 **`package.zip`** 作为附件。
5. 在 Release 说明里写上 **最低思源版本**（复制 `minAppVersion`）。

---

## 4. 上架与集市索引

集市侧会从各插件仓库的 Release 拉取 **`package.zip`** 并更新索引；**首次收录**或**索引格式变更**时，请以当时的官方文档为准，不要在本文假设某个 JSON 索引文件的字段。

---

## 5. 本地验证清单（发布前）

- [ ] 在干净工作空间里解压 zip，路径是否为 **`data/plugins/<包名>/`**。
- [ ] 思源版本 ≥ **`minAppVersion`**。
- [ ] 当前环境的 **`backends` / `frontends`** 与 `plugin.json` 声明一致。
- [ ] 禁用再启用插件后无控制台报错。

更多运行时问题见 [调试与排错](./debugging)。
