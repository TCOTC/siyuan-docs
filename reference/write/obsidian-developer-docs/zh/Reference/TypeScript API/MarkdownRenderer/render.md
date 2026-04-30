---
aliases: "MarkdownRenderer.render"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownRenderer`](MarkdownRenderer) › [`渲染`](MarkdownRenderer/渲染)

## MarkdownRenderer.render() 方法

将 Markdown 字符串呈现为 HTML 元素。

**签名：**

```typescript
static render(app: App, markdown: string, el: HTMLElement, sourcePath: string, component: Component): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>应用程序</code> | [`应用程序`]（应用程序）|对应用程序对象的引用 |
|  <code>降价</code> | <code>字符串</code> | Markdown 源代码 |
|  <code>el</code> | <code>HTMLElement</code> |要附加到 | 的元素
|  <code>源路径</code> | <code>字符串</code> |该Markdown文件的规范化路径，用于解析相关内部链接 |
|  <code>组件</code> | [`组件`]（组件）|用于管理呈现的子组件的生命周期的父组件。 |

**退货：**

`承诺<无效>`

