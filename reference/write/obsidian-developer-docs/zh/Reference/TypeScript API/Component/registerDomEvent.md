---
aliases: "Component.registerDomEvent"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Component`](组件) › [`registerDomEvent`](组件/registerDomEvent)

## Component.registerDomEvent() 方法

注册一个 DOM 事件，以便在卸载时分离

 0.14.8

**签名：**

```typescript
registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>el</code> | <code>窗口</code> |  |
|  <code>类型</code> | <code>K</code> |  |
|  <code>回调</code> | <code>(this: </code><code>HTMLElement</code><code>, ev: </code><code>WindowEventMap</code><code>[K]) =>;任何</code> |  |
|  <code>选项</code> | <code>布尔值 &#124; </code><code>AddEventListenerOptions</code> | _（可选）_ |

**退货：**

`无效`

