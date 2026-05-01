Obsidian 编辑器支持包含数百万行的[巨大文档](https://codemirror.net/examples/million/)。这是可能的原因之一是因为编辑器只渲染可见的内容（以及更多）。

想象一下，您想要编辑一个太大而无法在显示器上显示的文档。 Obsidian 编辑器创建一个在文档中移动的“窗口”，仅渲染窗口内的内容（并忽略窗口外的内容）。该窗口称为编辑器的_viewport_。

![视口](viewport.svg)

每当用户滚动文档或文档本身发生更改时，视口就会过时并需要重新计算。

如果您想构建依赖于视口的编辑器扩展，请参阅 [View plugins](./View%20plugins.md)。

> [!note]
> 本页面旨在为 Obsidian 插件开发人员提炼官方 CodeMirror 6 文档。有关状态管理的更多信息，请参阅 [Viewport](https://codemirror.net/docs/guide/#viewport)。
