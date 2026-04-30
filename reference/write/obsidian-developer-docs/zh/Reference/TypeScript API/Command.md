---
aliases: "Command"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`命令`]（命令）

## 命令接口


**签名：**

```typescript
export interface Command 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`回调？`]（命令/回调）|  | <代码>() =>任何</code> | _（可选）_ 简单回调，全局触发。 |
|  [`checkCallback？`]（命令/checkCallback）|  | <代码>（检查：布尔值）=>布尔值 &#124;无效</code> | _（可选）_ 复杂回调，覆盖简单回调。用于“检查”您的命令在当前情况下是否可以执行。例如，如果您的命令要求活动的焦点窗格是 MarkdownView，那么您应该仅在满足条件时返回 true。返回 false 或未定义会导致命令从命令选项板中隐藏。 |
|  [`editorCallback？`](命令/editorCallback) |  | <code>(编辑器：</code>[`Editor`](编辑器)<code>，ctx: </code>[`MarkdownView`](MarkdownView)<code> &#124; </code>[`MarkdownFileInfo`](MarkdownFileInfo)<code>) =>任何</code> | _（可选）_ 仅当用户位于编辑器中时才会触发的命令回调。覆盖 <code>callback</code> 和 <code>checkCallback</code> |
|  [`editorCheckCallback？`](命令/editorCheckCallback) |  | <code>(检查：布尔值，编辑器：</code>[`Editor`](Editor)<code>, ctx: </code>[`MarkdownView`](MarkdownView)<code> &#124; </code>[`MarkdownFileInfo`](MarkdownFileInfo)<code>) =>布尔值 &#124;无效</code> | _（可选）_ 仅当用户位于编辑器中时才会触发的命令回调。覆盖 <code>editorCallback</code>、<code>callback</code> 和 <code>checkCallback</code> |
|  [`热键？`]（命令/热键）|  | [`热键`](热键)<code>[]</code> | _（可选）_ 设置默认热键。建议插件尽可能避免设置默认热键，以避免热键与用户设置的热键发生冲突，即使自定义热键具有更高的优先级。 |
|  [`图标？`]（命令/图标）|  | [`图标名称`](图标名称) | _（可选）_ 工具栏中使用的图标 ID。请参阅 [https://docs.obsidian.md/Plugins/User+interface/Icons](https://docs.obsidian.md/Plugins/User+interface/Icons) 了解可用图标以及如何添加自己的图标。 |
|  [`id`]（命令/id）|  | <code>字符串</code> |用于标识此命令的全局唯一 ID。 |
|  [`仅限移动设备？`]（命令/仅限移动设备）|  | <code>布尔值</code> | _（可选）_ |
|  [`名称`]（命令/名称）|  | <code>字符串</code> |便于搜索的人类友好名称。 |
|  [`可重复？`]（命令/可重复）|  | <code>布尔值</code> | _（可选）_ 按住热键是否应重复触发此命令。 |

