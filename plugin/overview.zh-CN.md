---
title: 插件开发概览
description: 插件的运行环境、加载链路与生命周期
---

思源**插件**也称为 **Petal**（花瓣）：运行在**思源客户端界面进程**里的 JavaScript，通过 **`fetchPost`** 等与**本地 HTTP API**交互，扩展编辑器、命令与界面。

---

## 架构示意图（逻辑）

```text
┌─────────────────────────────────────────────────────────┐
│ 思源客户端（Electron / 浏览器 / 移动端 WebView）          │
│  ┌─────────────┐    fetchPost / WebSocket    ┌──────────┐ │
│  │ 插件 index.js │ ─────────────────────────► │ HTTP API │ │
│  │ extends Plugin│                             │ :6806    │ │
│  └─────────────┘                             └──────────┘ │
└─────────────────────────────────────────────────────────┘
         │ 读写笔记本数据、附件等须经过上述 API
         ▼
   {工作空间}/data/...
```

插件**不是**任意访问磁盘的后台脚本；不要用 **`require('fs')`** 直接改笔记本目录下的原始文件，应使用 **`API.md`** 中的接口。

---

## 目录约定

启用后的插件位于：

**`{工作空间}/data/plugins/<包名>/`**

思源按固定文件名读取插件包：

| 文件 | 必需 | 说明 |
| --- | --- | --- |
| **`index.js`** | 是 | webpack / esbuild 等打包产物；加载后注入前端执行 |
| **`index.css`** | 否 | 存在则一并注入 |
| **`plugin.json`** | 强烈建议 | 本地与集市清单（`Package` 元数据）、兼容性判断 |
| **`i18n/*.json`** | 否 | 插件界面文案 |

入口文件名**固定为 `index.js`**，**不在** `plugin.json` 里配置 `main`。

---

## 加载链路（简化）

1. 客户端请求 **`/api/petal/loadPetals`**，返回已启用插件的 **`js` / `css` / `i18n`**。
2. **`loader.ts`** 用 **`eval`** 包装函数执行插件脚本，取出 **`export default`**。
3. `new PluginSubclass({ app, name, displayName, i18n })`，执行 **`await onload()`**。

任一环节抛错都会在控制台打出 **`plugin <name> run error`** 或 **`onload error`**。

---

## 生命周期与钩子

| 方法 | 调用时机 |
| --- | --- |
| **`onload`** | 插件启用后立即调用；注册命令、菜单、`eventBus`、Dock 等 |
| **`onunload`** | 禁用前调用；**必须**移除监听、定时器、DOM |
| **`onLayoutReady`** | 主布局就绪后 |
| **`onDataChanged`** | 插件存储同步变更（见源码注释，与多端同步有关） |
| **`uninstall`** | 卸载流程需要时可重写 |

此外还有 **`updateProtyleToolbar`**、**`updateCards`** 等可选重写点。

---

## 与其它集市包的关系

| 类型 | 何时选插件 |
| --- | --- |
| 主题 | 只需换肤、改 CSS 变量 → 用主题 |
| 模板 | 只需插入片段 → 模板包 |
| 挂件 | 独立页面 iframe → 挂件 |
| 图标 | 换 emoji / 图标方案 → 图标包 |
| 插件 | 要注册命令、调用 HTTP API、改编辑器行为 → **插件** |

---

## 兼容性与信任

- **`minAppVersion`**：低于该版本的思源不应启用插件。
- **`backends` / `frontends`**：与当前运行环境不匹配时，可能被判定为不兼容而不加载。
- **集市信任**：部分环境下需用户信任集市后才会加载插件列表（与客户端设置有关）。

---

## 下一步阅读

1. [快速上手](./quickstart.zh-CN.md)
2. [plugin.json](./manifest.zh-CN.md)
3. [前端 Plugin API](./frontend-api.zh-CN.md)
