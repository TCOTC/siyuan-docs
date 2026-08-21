---
title: plugin.json 说明
description: 插件清单字段与运行环境约束
---

`plugin.json` 位于插件包根目录，描述插件名称、版本、最低思源版本、适用的后端/前端环境，以及集市展示所需的文案与链接。下面字段说明与官方插件示例仓库保持一致；若你的思源版本较旧，请以当时客户端解析逻辑为准。

## 示例

```json
{
  "name": "plugin-sample",
  "author": "Vanessa",
  "url": "https://github.com/siyuan-note/plugin-sample",
  "version": "0.4.7",
  "minAppVersion": "3.6.4",
  "backends": ["windows", "linux", "darwin", "ios", "android", "harmony", "docker", "all"],
  "frontends": ["desktop", "mobile", "browser-desktop", "browser-mobile", "desktop-window", "all"],
  "disabledInPublish": false,
  "displayName": {
    "default": "Plugin Sample",
    "zh_CN": "插件示例"
  },
  "description": {
    "default": "This is a plugin development sample",
    "zh_CN": "这是一个插件开发示例"
  },
  "readme": {
    "default": "README.md",
    "zh_CN": "README_zh_CN.md"
  },
  "funding": {
    "openCollective": "",
    "patreon": "",
    "github": "",
    "custom": ["https://ld246.com/sponsor"]
  },
  "keywords": ["开发者参考", "developer reference", "示例插件"]
}
```

## 字段说明

| 字段 | 说明 |
| --- | --- |
| **`name`** | 插件包名。应与 GitHub 仓库名一致，且在集市中不与其它插件重名。 |
| **`author`** | 作者展示名。 |
| **`url`** | 插件源码仓库地址（通常为 GitHub）。 |
| **`version`** | 插件版本，建议使用语义化版本（[semver](https://semver.org/)）。 |
| **`minAppVersion`** | 能够正常运行所需的**最低思源笔记版本**；低于该版本时客户端应提示升级或拒绝启用。 |
| **`disabledInPublish`** | 若在「发布服务」场景下应禁用该插件，设为 `true`；默认 `false`。 |
| **`backends`** | 插件声明支持的运行后端：`windows`、`linux`、`darwin`、`docker`、`android`、`ios`、`harmony`，或使用 **`all`**。不满足时不加载。 |
| **`frontends`** | 声明支持的前端形态：`desktop`（桌面主窗口）、`desktop-window`（由页签转出的独立窗口）、`mobile`、`browser-desktop`、`browser-mobile`，或 **`all`**。 |
| **`displayName`** | 集市与设置中显示的标题。必须包含 **`default`**；可按语言增加 `zh_CN`、`en_US` 等。若主语言是英文，建议把英文放在 `default`。 |
| **`description`** | 短描述，用于列表展示。同样需有 `default`，其它语言可选。 |
| **`readme`** | 各语言详情页使用的 Markdown 文件名，如 `README.md`、`README_zh_CN.md`。 |
| **`funding`** | 赞助入口；集市通常只展示一种。可填 Open Collective、`patreon`、GitHub 用户名，或 **`custom`** 自定义链接数组。 |
| **`keywords`** | 集市搜索用的关键词，用于补充 `name`、`author`、`displayName`、`description` 未覆盖的检索词。 |

## 与入口脚本的关系

插件入口固定为包内的 **`index.js`**（由构建生成），**不在** `plugin.json` 里配置 `main`。清单主要负责元数据与兼容性，不负责指定脚本文件名。

## `backends` 可选值

| 值 | 含义 |
| --- | --- |
| `windows` | Windows 桌面端 |
| `linux` | Linux 桌面端 |
| `darwin` | macOS 桌面端 |
| `docker` | Docker 部署 |
| `android` | Android 客户端 |
| `ios` | iOS 客户端 |
| `harmony` | HarmonyOS 客户端 |
| `all` | 不限制上述后端 |

## `frontends` 可选值

| 值 | 含义 |
| --- | --- |
| `desktop` | 传统桌面主窗口 |
| `desktop-window` | 从页签拖出的独立窗口 |
| `mobile` | 移动端 App |
| `browser-desktop` | 桌面浏览器访问 |
| `browser-mobile` | 移动浏览器访问 |
| `all` | 不限制上述前端 |

仅在你**确实无法**在某环境测试时，才避免填 `all`，并在 README 中写明已测环境。

## `funding` 与展示规则

- 可分别填写 **Open Collective**、**Patreon**、**GitHub Sponsors** 短名，或 **custom** 数组里放完整 URL。
- 集市界面通常**只选一种**展示，具体优先级以后台 / 客户端为准。

## 下一步

- [前端 Plugin API](./frontend-api.zh-CN.md)。
