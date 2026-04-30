---
aliases: "MarkdownRenderer"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownRenderer`](MarkdownRenderer)

## MarkdownRenderer 类

 0.9.7

**签名：**

```typescript
export abstract class MarkdownRenderer extends MarkdownRenderChild implements MarkdownPreviewEvents, HoverParent 
```
**扩展：** [`MarkdownRenderChild`](MarkdownRenderChild)

**实现：** [`MarkdownPreviewEvents`](MarkdownPreviewEvents)<!-- -->, [`HoverParent`](HoverParent)

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(containerEl)`](MarkdownRenderChild/(构造函数).md) |  | <p>构造 <code>MarkdownRenderChild</code> 类的新实例</p><p>（继承自 [MarkdownRenderChild](MarkdownRenderChild)<!-- -->)</p> |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`应用程序`](MarkdownRenderer/应用程序) |  | [`应用程序`]（应用程序）|  |
|  [`containerEl`](MarkdownRenderChild/containerEl) |  | <code>HTMLElement</code> | <p>（继承自 [MarkdownRenderChild](MarkdownRenderChild)<!-- -->)</p> |
|  [`文件`](MarkdownRenderer/文件) | <p><code>抽象</code></p><p><code>只读</code></p> | [`TFile`](TFile) |  |
|  [`hoverPopover`](MarkdownRenderer/hoverPopover) |  | [`HoverPopover`](HoverPopover)<code> &#124;空</code> |  |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addChild(组件)`](组件/addChild) |  | <p>添加一个子组件，如果该组件已加载，则加载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`load()`]（组件/负载）|  | <p>加载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onload()`](组件/onload) |  | <p>覆盖此内容以加载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onunload()`](组件/onunload) |  | <p>重写此设置以卸载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`register(cb)`]（组件/寄存器）|  | <p>注册卸载时调用的回调</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](组件/registerDomEvent) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_1) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_2) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerEvent(eventRef)`](组件/registerEvent) |  | <p>注册卸载时要分离的事件</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerInterval(id)`](组件/registerInterval) |  | <p>注册一个间隔（来自 setInterval），在卸载时取消使用，以避免 NodeJS 与浏览器 API 之间的 TypeScript 混淆</p><p> 0.13.8</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`removeChild(组件)`](组件/removeChild) |  | <p>删除子组件，卸载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`渲染（应用程序，markdown，el，sourcePath，组件）`]（MarkdownRenderer /渲染）| <code>静态</code> |将 Markdown 字符串呈现为 HTML 元素。 |
|  [`renderMarkdown(markdown, el, sourcePath, 组件)`](MarkdownRenderer/renderMarkdown) | <code>静态</code> |将 Markdown 字符串呈现为 HTML 元素。 |
|  [`unload()`]（组件/卸载）|  | <p>卸载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |

