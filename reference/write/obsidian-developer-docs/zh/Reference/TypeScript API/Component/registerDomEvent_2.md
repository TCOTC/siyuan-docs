---
aliases: "Component.registerDomEvent_2"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`组件`](组件) › [`registerDomEvent`](组件/registerDomEvent_2)

## Component.registerDomEvent() 方法

注册一个 DOM 事件，以便在卸载时分离

 0.14.8

**签名：**

```typescript
registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>el</code> | <code>HTMLElement</code> |  |
|  <code>类型</code> | <code>K</code> |  |
|  <code>回调</code> | <code>(this: </code><code>HTMLElement</code><code>, ev: </code><code>HTMLElementEventMap</code><code>[K]) =>;任何</code> |  |
|  <code>选项</code> | <code>布尔值 &#124; </code><code>AddEventListenerOptions</code> | _（可选）_ |

**退货：**

`无效`

