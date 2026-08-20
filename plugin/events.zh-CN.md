---
title: 事件参考（eventBus）
description: TEventBus 事件名与使用说明
---

插件通过 **`this.eventBus`** 订阅思源内部广播（实现见 **`app/src/plugin/EventBus.ts`**）。事件名字符串类型 **`TEventBus`** 定义在 **`app/src/types/index.d.ts`**。下列分组便于查阅，**以源码为准**；若升级后类型有增减，请直接对比仓库中的 `index.d.ts`。

订阅时注意在 **`onunload`** 里对同一 listener 调用 **`off`**，避免重复启用插件后多次触发。

---

## 同步与 WebSocket

| 事件名 | 典型用途 |
| --- | --- |
| `ws-main` | 主连接相关 |
| `sync-start` | 同步开始 |
| `sync-end` | 同步结束 |
| `sync-fail` | 同步失败 |

---

## 编辑器与点击

| 事件名 | 典型用途 |
| --- | --- |
| `click-blockicon` | 点击块标 |
| `click-editorcontent` | 点击编辑器内容区 |
| `click-pdf` | PDF 视图点击 |
| `click-editortitleicon` | 文档标题栏图标 |
| `click-flashcard-action` | 闪卡相关操作 |

---

## 菜单打开（扩展块菜单等）

| 事件名 |
| --- |
| `open-noneditableblock` |
| `open-menu-blockref` |
| `open-menu-fileannotationref` |
| `open-menu-tag` |
| `open-menu-link` |
| `open-menu-image` |
| `open-menu-av` |
| `open-menu-content` |
| `open-menu-breadcrumbmore` |
| `open-menu-doctree` |
| `open-menu-inbox` |

思源在打开某些菜单前会向插件派发事件，便于注入子菜单项（可与 **`emitOpenMenu`** 流程配合，见 `EventBus.ts` 导出函数）。

---

## 笔记本与链接

| 事件名 | 典型用途 |
| --- | --- |
| `open-siyuan-url-plugin` | 打开 `siyuan://` 插件相关 URL |
| `open-siyuan-url-block` | 打开块相关 URL |
| `opened-notebook` | 笔记本打开 |
| `closed-notebook` | 笔记本关闭 |

---

## 编辑器全局行为

| 事件名 |
| --- |
| `paste` |
| `input-search` |

---

## Protyle 生命周期

| 事件名 | 典型用途 |
| --- | --- |
| `loaded-protyle-dynamic` | 动态加载的编辑器就绪 |
| `loaded-protyle-static` | 静态场景编辑器就绪 |
| `switch-protyle` | 切换编辑器实例 |
| `switch-protyle-mode` | 切换编辑模式 |
| `destroy-protyle` | 编辑器销毁 |

在这些钩子里更新插件内部缓存、移除 DOM 监听，可避免泄漏。

---

## 移动端与其它

| 事件名 |
| --- |
| `lock-screen` |
| `mobile-keyboard-show` |
| `mobile-keyboard-hide` |
| `code-language-update` |
| `code-language-change` |

---

## 示例

```ts
export default class ListenSync extends Plugin {
	private onEnd = (e: CustomEvent) => {
		console.log("sync-end", e.detail);
	};

	async onload() {
		this.eventBus.on("sync-end", this.onEnd);
	}

	onunload() {
		this.eventBus.off("sync-end", this.onEnd);
	}
}
```

更多用法请全局搜索思源源码中对 **`eventBus.emit`** 的调用，确认 **`detail`** 载荷结构。
