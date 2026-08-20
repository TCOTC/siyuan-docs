---
title: 前端 Plugin API
description: Plugin 基类、命令、界面扩展、存储与事件总线
---

思源前端在 npm 上发布包名 **`siyuan`**（社区常称 **Petal** 类型定义来源）。插件在工程里 `import { Plugin, … } from "siyuan"`，与主程序使用同一套类型时，将 `siyuan` 的版本固定在与目标思源兼容的范围。

权威实现：**`app/src/plugin/index.ts`**（类 **`Plugin`**）、**`app/src/plugin/loader.ts`**（加载）、**`app/src/plugin/EventBus.ts`**（事件）。

---

## 1. 最小插件骨架

```ts
import { Plugin } from "siyuan";

export default class MyPlugin extends Plugin {
	async onload() {
		// 启用插件时调用（可为 async）
	}

	onunload() {
		// 禁用 / 卸载前务必清理
	}
}
```

加载器要求：

1. **`export default`** 导出类；
2. 该类 **`extends Plugin`**；
3. 否则会报错：`plugin xxx has no export` / `does not extends Plugin`。

---

## 2. 国际化 `this.i18n`

启用插件时，思源会在插件目录下查找 **`i18n/<语言>.json`**（如 `zh_CN.json`、`en_US.json`），并与当前工作空间语言匹配，填充 **`this.i18n`**。

**`src/i18n/zh_CN.json` 示例：**

```json
{
	"hello": "你好",
	"saveOk": "保存成功"
}
```

**代码中：**

```ts
showMessage(this.i18n.hello);
```

建议至少提供 **英文 + 简体中文**，其它语种按需追加；未声明的语言不必在 `plugin.json` 的 `displayName` 等字段里硬写。

---

## 3. 命令 `addCommand`

```ts
this.addCommand({
	langKey: "openPanel",        // 与 i18n、快捷键设置中的键一致
	hotkey: "⇧⌘O",
	callback: () => {
		/* 在允许的前端上下文中执行 */
	},
	globalCallback: () => {
		/* 全局快捷键，不依赖当前编辑器焦点时 */
	},
});
```

思源会把默认键与用户自定义保存到 **`window.siyuan.config.keymap.plugin[你的插件名][langKey]`**。若 `langKey` 重复或数据异常，源码会打 `console.error` 并可能丢弃该命令。

---

## 4. 顶栏与状态栏

### `addTopBar`

```ts
this.addTopBar({
	icon: "iconEmoji",          // 现有 SVG 图标的 id，见界面里已用的 #iconXxx
	title: this.i18n.hello,
	position: "right",          // 可选，与顶栏区域有关
	callback: (evt) => {
		// 点击逻辑
	},
});
```

`icon` 可以是 **以 `icon` 开头的 id**，或 **整段内联 `<svg>...</svg>`**；否则会 `console.error`（见 `Plugin.addTopBar` 源码）。

### `addStatusBar`

```ts
const el = document.createElement("span");
el.textContent = "0";
this.addStatusBar({ element: el, position: "right" });
```

移动端 / 桌面分支在源码中有条件编译（`/// #if MOBILE`），请以当前思源版本的 **`Plugin.addStatusBar`** 为准。

---

## 5. 图标 `addIcons`

向页面注入隐藏 **`SVG`** 容器，内含 **`<symbol id="...">`**，供 `<use xlink:href="#id">` 引用：

```ts
this.addIcons(`
<symbol id="iconMyBadge" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14"/>
</symbol>
`);
```

官方示例 **`plugin-sample`** 中有完整的多符号拼接范例。

---

## 6. 设置面板 `Setting`

```ts
import { Setting } from "siyuan";

this.setting = new Setting({
	confirmCallback: () => {
		this.saveData("settings", { flag: true }).catch(console.error);
	},
});
this.setting.addItem({
	title: "选项标题",
	description: "说明文字",
	direction: "row",
	createActionElement: () => {
		const input = document.createElement("input");
		input.type = "checkbox";
		return input;
	},
});
```

用户在思源设置里打开插件配置时，会调用 **`openSetting()`**（若已挂载 `this.setting`）。

---

## 7. 自定义页签 `addTab`（桌面端为主）

```ts
const factory = this.addTab({
	type: "my_tab",
	init() {
		this.element.innerHTML = `<div class="fn__flex-1">${this.data.note ?? ""}</div>`;
	},
	destroy() {
		console.log("tab destroy");
	},
});
```

返回值为构造自定义 **`Custom`** 页签模型的工厂；**`type`** 实际会变成 **`插件名 + type`** 拼接（见源码）。

---

## 8. Dock 面板 `addDock`

```ts
this.addDock({
	type: "dock_demo",
	config: {
		position: "LeftBottom",
		size: { width: 220, height: 0 },
		icon: "iconEmoji",
		title: "My Dock",
		hotkey: "⌥⌘W",
	},
	data: { text: "hello" },
	init(dock) {
		dock.element.innerHTML = `<div class="fn__flex-1">${dock.data.text}</div>`;
	},
});
```

移动端与桌面端 DOM 结构不同，可参考 **`plugin-sample`** 里对 `getFrontend()` 的分支。

---

## 9. Protyle 编辑器扩展

### 工具栏 `updateProtyleToolbar`

```ts
updateProtyleToolbar(toolbar) {
	toolbar.push("|");
	toolbar.push({
		name: "demo-btn",
		icon: "iconEmoji",
		title: this.i18n.hello,
		click(protyle) {
			protyle.insert("你好");
		},
	});
	return toolbar;
}
```

### 斜杆菜单 `protyleSlash`

在插件类上赋值数组（类型见源码），每项包含 **`filter`**（搜索关键字）、**`html`**、**`id`**、**`callback(protyle, nodeElement)`**。

### `protyleOptions`

可缩小默认工具栏按钮集合等；类型为 **`IProtyleOptions`**，需与当前思源版本类型定义一致。

---

## 10. 数据存储 `loadData` / `saveData` / `removeData`

路径落在 **`/data/storage/petal/<插件名>/<存储名>`**，内部使用 **`/api/file/getFile`**、**`putFile`**、**`removeFile`**。

```ts
await this.loadData("cfg");              // 读到 this.data.cfg
await this.saveData("cfg", { a: 1 });    // 序列化为 JSON 文件
await this.removeData("cfg");
```

只读模式或发布模式下 **`saveData`** 会 **reject**（403）。

---

## 11. 调用 HTTP API：`fetchPost`

多数场景使用 **`fetchPost(url, body, cb)`**（定义见 `app/src/util/fetch.ts`）。示例：列出笔记本：

```ts
import { fetchPost } from "siyuan";

fetchPost("/api/notebook/lsNotebooks", {}, (response) => {
	if (response.code !== 0) {
		showMessage(response.msg);
		return;
	}
	console.log(response.data.notebooks);
});
```

带 Token、统一错误格式等约定见 [HTTP API 与数据规范](./http-api)。

---

## 12. 事件总线 `this.eventBus`

API：**`on`**、**`once`**、**`off`**、**`emit`**（见 `EventBus.ts`）。事件名字符串集合为 **`TEventBus`**，完整列表见 [插件 · 事件参考](./events)。

```ts
const onSync = (e: CustomEvent) => {
	console.log("sync", e.detail);
};
this.eventBus.on("sync-end", onSync);

// onunload 中必须 off，且传入同一函数引用
this.eventBus.off("sync-end", onSync);
```

---

## 13. 常用辅助导入（节选）

从 **`siyuan`** 常导入：`showMessage`、`confirm`、`Dialog`、`Menu`、`openTab`、`openWindow`、`Protyle`、`getFrontend`、`getBackend`、`adaptHotkey`、`Constants`、`Files` 等，与 **`plugin-sample`** 顶部 import 列表对齐即可。

---

## 14. 与其它章节的关系

| 主题 | 文档 |
| --- | --- |
| 清单字段 | [plugin.json](./manifest) |
| HTTP 与文件规范 | [HTTP API 与数据规范](./http-api) |
| 调试与排错 | [调试与排错](./debugging) |
| 事件名一览 | [事件参考](./events) |
