---
title: 插件开发概览
description: 示例章节，便于看侧栏与版式
order: 1
---

这里可以写插件生命周期、入口 manifest、与内核通信等。**当前 Markdown 仍由 Astro 默认引擎渲染**，与生产环境若需 Lute 一致，可在构建管线中替换为 Lute 输出 HTML。

### 代码示例

```ts
export default class PluginSample {
	async onload() {
		console.log('Hello, SiYuan');
	}
}
```

行内代码如 `plugin.json` 也会套用细边框样式。
