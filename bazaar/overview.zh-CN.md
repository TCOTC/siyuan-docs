---
title: 集市包总览
description: 五类集市包、安装路径与通用元数据
---

思源「集市」分发多种**扩展包**。各类包使用统一的 **`Package`** 元数据（JSON 与程序内结构对应，见开源仓库），再按类型放入不同目录、使用不同清单文件名。

## 五类集市包

| 类型 | 清单文件 | 默认安装目录（工作空间下） | 典型用途 |
| --- | --- | --- | --- |
| **插件** | `plugin.json` | `data/plugins/<包名>/` | 脚本扩展编辑器、命令、Dock、与 **HTTP API** 交互 |
| **主题** | `theme.json` | `appearance/themes/<包名>/` | `theme.css` 等覆盖界面样式 |
| **图标包** | `icon.json` | `appearance/icons/<包名>/` | 图标资源，在设置中选用的图标方案 |
| **模板** | `template.json` | `data/templates/<包名>/` | 插入文档时使用的 Markdown / 模板片段 |
| **挂件** | `widget.json` | `data/widgets/<包名>/` | 以 iframe 嵌入文档的静态页面（HTML/JS/CSS） |

上表已列出各类型的默认安装位置；若需与程序行为逐行对照，可在思源开源仓库中搜索相关安装逻辑。

## 通用元数据字段（`Package`）

下列字段在各类包中**共用**（主题额外有 `modes`；插件额外有 `backends`、`frontends` 等）。解析与展示时会做 HTML 转义以防 XSS（`ParsePackageJSON` / `sanitizePackageDisplayStrings`）。

| 字段 | 含义 |
| --- | --- |
| `name` | 包名；目录名通常与此一致 |
| `author` | 作者 |
| `url` | 项目主页（一般为 GitHub 仓库） |
| `version` | 版本号，建议 semver |
| `minAppVersion` | 最低思源版本 |
| `displayName` | 多语言显示名，`default` 必填 |
| `description` | 多语言短描述 |
| `readme` | 各语言 README 文件名映射 |
| `funding` | 赞助信息 |
| `keywords` | 集市搜索关键词 |
| `disabledInPublish` | 在发布服务中是否禁用（插件等） |
| `backends` / `frontends` | **插件专用**：可用后端/前端环境 |

主题专有：

| 字段 | 含义 |
| --- | --- |
| `modes` | 字符串数组，元素为 `light` 和/或 `dark`，见 [主题 manifest](../theme/manifest) |

插件专有（节选，完整见 [plugin.json](../plugin/manifest)）：

| 字段 | 含义 |
| --- | --- |
| `backends` | `windows`、`linux`、`darwin`、`docker`、`android`、`ios`、`harmony`、`all` |
| `frontends` | `desktop`、`desktop-window`、`mobile`、`browser-desktop`、`browser-mobile`、`all` |
| `disabledInPublish` | 发布模式下是否禁用 |

## 安装与加载（概念）

- 用户在集市中安装某包后，客户端下载 **`package.zip`** 并解压到上表对应目录。
- 客户端根据清单 JSON 做兼容性判断；启用插件时通过 **`/api/petal/loadPetals`** 拉取 `index.js` 并在界面进程中执行。

## 与「社区集市」索引的关系

集市索引与上架流程可能重构；**不要**把本文当作唯一上架依据。通用要求是：仓库发 **Release**、附 **`package.zip`**、清单字段合法、资源尺寸符合规范。详见 [发布与版本](./publishing)。

## 下一步

- [发布与版本](./publishing)
- 各类包详细说明：[插件](../plugin/overview)、[主题](../theme/overview)、[图标包](../icons/overview)、[模板](../templates/overview)、[挂件](../widgets/overview)
