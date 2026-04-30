---
aliases: "HoverPopover"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`HoverPopover`](HoverPopover)

## HoverPopover 类

 0.15.0

**签名：**

```typescript
export class HoverPopover extends Component 
```
**扩展：** [`组件`]（组件）

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(parent, targetEl, waitTime, staticPos)`](HoverPopover/(构造函数).md) |  |构造 <code>HoverPopover</code> 类的新实例 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`hoverEl`](HoverPopover/hoverEl) |  | <code>HTMLElement</code> |  |
|  [`状态`](HoverPopover/状态) |  | [`PopoverState`](PopoverState) |  |

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
|  [`unload()`]（组件/卸载）|  | <p>卸载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |

