---
title: 调试与排错
description: 开发者工具、常见报错与排查顺序
order: 26
---

## 打开开发者工具

与 Chromium 一致：**Windows / Linux** 使用 `Ctrl+Shift+I`，**macOS** 使用 `Cmd+Option+I`，打开后切到 **Console** 与 **Network**。

建议在 **`onload` / `onunload`** 里临时 `console.log`，确认生命周期是否按预期触发。

---

## 插件脚本报错（加载阶段）

加载器（**`app/src/plugin/loader.ts`**）在下列情况会 **`console.error`** 并中止：

| 日志片段 | 含义 | 处理 |
| --- | --- | --- |
| `plugin xxx run error` | `index.js` 执行抛错 | 检查语法、顶层是否访问了仅浏览器可用的 API、构建目标是否正确 |
| `plugin xxx has no export` | 未提供 `export default` | 改为默认导出类 |
| `plugin xxx does not extends Plugin` | 类未继承 `Plugin` | `class X extends Plugin` |
| `plugin xxx js not found` | 客户端读不到 `index.js` | 确认路径为 `data/plugins/<包名>/index.js` 且已构建 |

---

## 运行时与兼容性

| 现象 | 可能原因 |
| --- | --- |
| 插件未出现在已启用列表 | `plugin.json` 中 **`minAppVersion`** 过高，或 **`backends` / `frontends`** 与当前环境不匹配 |
| 集市无法加载 | 未信任集市 / 当前运行环境（如部分 Docker 场景）下的限制 |
| `saveData` 失败 | 工作空间只读、发布模式、或路径非法 |

---

## 网络与 API

在 **Network** 面板筛选 **`fetch`** / **`XHR`**：

- 插件请求应指向 **`127.0.0.1:<端口>`**（或你的 Docker 映射）。
- 若返回 **401**，检查 **`Authorization: Token …`** 是否在 `fetchPost` 封装中自动带上（部分接口需要）。
- **`code !== 0`** 时阅读 **`msg`**，对照 [HTTP API 与数据规范](./plugin-http-api) 与 `API_zh_CN.md`。

---

## 事件监听泄漏

若禁用插件后仍然触发回调，通常是 **`eventBus.on` 未在 `onunload` 中 `off`**。必须使用**同一函数引用**调用 `off`。

---

## 样式污染

插件 CSS 通过 **`index.css`** 注入。尽量使用**作用域类名**（如 `.plugin_myname_xxx`），避免覆盖全局 `.b3-*` 导致主题异常。

---

## 仍无法解决时

1. 用**最小插件**（仅 `onload` 打日志）验证环境。
2. 对照 **官方 plugin-sample** 与当前思源 **版本号**。
3. 到思源 GitHub **Discussion / Issues** 搜索关键词或带日志提问。
