---
aliases: "MarkdownPreviewRenderer.createCodeBlockPostProcessor"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownPreviewRenderer`](MarkdownPreviewRenderer) › [`createCodeBlockPostProcessor`](MarkdownPreviewRenderer/createCodeBlockPostProcessor)

## MarkdownPreviewRenderer.createCodeBlockPostProcessor() 方法

 11.0.12

**签名：**

```typescript
static createCodeBlockPostProcessor(language: string, handler: (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => Promise<any> | void): (el: HTMLElement, ctx: MarkdownPostProcessorContext) => void;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>语言</code> | <code>字符串</code> |  |
|  <code>处理程序</code> | <code>(source: string, el: </code><code>HTMLElement</code><code>, ctx: </code>[`MarkdownPostProcessorContext`](MarkdownPostProcessorContext)<code>) =>; </code><code>承诺</code><code><任何> &#124;无效</code> |  |

**退货：**

`(el: ``HTMLElement``, ctx: `[`MarkdownPostProcessorContext`](MarkdownPostProcessorContext)`) => void`

