---
aliases: editor extension
---

编辑器扩展可让您自定义在 Obsidian 中编辑笔记的体验。本页介绍了什么是编辑器扩展以及何时使用它们。

Obsidian 使用 CodeMirror 6 (CM6) 来支持 Markdown 编辑器。就像 Obsidian 一样，CM6 有自己的插件，称为_extensions_。换句话说，Obsidian _editor 扩展_ 与 _CodeMirror 6 扩展_ 是一样的。

用于构建编辑器扩展的 API 有点非常规，要求您在开始之前对其架构有基本的了解。本节旨在为您提供足够的背景信息和示例，以便您入门。如果您想了解有关构建编辑器扩展的更多信息，请参阅 [CodeMirror 6 文档](https://codemirror.net/docs/)。

## 我需要编辑器扩展吗？

构建编辑器扩展可能具有挑战性，因此在开始构建编辑器扩展之前，请考虑您是否真的需要它。

- 如果您想更改在阅读视图中将 Markdown 转换为 HTML 的方式，请考虑构建一个 [Markdown post processor](./Markdown%20post%20processing.md)。
- 如果您想更改文档在实时预览中的外观和感觉，您需要构建一个编辑器扩展。

## 注册编辑器扩展

CodeMirror 6 (CM6) 是一个使用 Web 技术编辑代码的强大引擎。从本质上讲，编辑器本身具有一组最少的功能。您期望从现代编辑器获得的任何功能都可以作为_扩展_提供，您可以挑选和选择。虽然 Obsidian 附带了许多开箱即用的扩展，但您也可以注册自己的扩展。

要注册编辑器扩展，请在 Obsidian 插件的 `onload` 方法中使用 [registerEditorExtension()](../../Reference/TypeScript%20API/Plugin/registerEditorExtension.md)：

```ts
onload() {
  this.registerEditorExtension([examplePlugin, exampleField]);
}
```

虽然 CM6 支持多种类型的扩展，但最常见的两种是 [View plugins](./View%20plugins.md) 和 [State fields](./State%20fields.md)。
<DocCardList items={useCurrentSidebarCategory().items}/>

