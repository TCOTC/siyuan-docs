---
aliases: "Plugin.registerMarkdownCodeBlockProcessor"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`插件`](插件) › [`registerMarkdownCodeBlockProcessor`](插件/registerMarkdownCodeBlockProcessor)

## Plugin.registerMarkdownCodeBlockProcessor() 方法

注册一个特殊的后处理器，用于处理给定语言和处理程序的隔离代码。这个特殊的后处理器负责删除“<pre><code>”并创建一个“<div>”，该“<div>”将传递给处理程序，并且预计将填充自定义元素。

**签名：**

```typescript
registerMarkdownCodeBlockProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void, sortOrder?: number): MarkdownPostProcessor;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>语言</code> | <code>字符串</code> |  |
|  <code>处理程序</code> | <code>(source: string, el: </code><code>HTMLElement</code><code>, ctx: </code>[`MarkdownPostProcessorContext`](MarkdownPostProcessorContext)<code>) =>; </code><code>承诺</code><code><任何> &#124;无效</code> |  |
|  <code>排序顺序</code> | <code>号码</code> | _（可选）_ |

**退货：**

[`MarkdownPostProcessor`](MarkdownPostProcessor)

