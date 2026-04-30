---
aliases: "Menu"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`菜单`]（菜单）

## 菜单类


**签名：**

```typescript
export class Menu extends Component implements CloseableComponent 
```**扩展：** [`组件`]（组件）

**实现：** [`CloseableComponent`](CloseableComponent)

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)()`](菜单/(构造函数).md) |  |构造 <code>Menu</code> 类的新实例 |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addChild(组件)`](组件/addChild) |  | <p>添加一个子组件，如果该组件已加载，则加载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`addItem(cb)`](菜单/addItem) |  |添加菜单项。仅当菜单尚未显示时才有效。 |
|  [`addSeparator()`](菜单/addSeparator) |  |添加分隔符。仅当菜单尚未显示时才有效。 |
|  [`close()`]（菜单/关闭）|  |  |
|  [`forEvent(evt)`](菜单/forEvent) | <code>静态</code> |  1.6.0 |
|  [`隐藏()`](菜单/隐藏) |  |  |
|  [`load()`]（组件/负载）|  | <p>加载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onHide(回调)`](菜单/onHide) |  |  |
|  [`onload()`](组件/onload) |  | <p>覆盖此内容以加载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onunload()`](组件/onunload) |  | <p>重写此设置以卸载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`register(cb)`]（组件/寄存器）|  | <p>注册卸载时调用的回调</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](组件/registerDomEvent) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_1) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_2) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerEvent(eventRef)`](组件/registerEvent) |  | <p>注册卸载时要分离的事件</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerInterval(id)`](组件/registerInterval) |  | <p>注册一个间隔（来自 setInterval），在卸载时取消使用，以避免 NodeJS 与浏览器 API 之间的 TypeScript 混淆</p><p> 0.13.8</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`removeChild(组件)`](组件/removeChild) |  | <p>删除子组件，卸载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`setNoIcon()`](菜单/setNoIcon) |  |  |
|  [`setUseNativeMenu(useNativeMenu)`](菜单/setUseNativeMenu) |  | <p>强制此菜单使用本机或 DOM。 （仅适用于桌面应用程序）</p><p> 0.16.0</p> |
|  [`showAtMouseEvent(evt)`](菜单/showAtMouseEvent) |  |  0.12.6 |
|  [`showAtPosition(位置，文档)`](菜单/showAtPosition) |  |  1.1.0 |
|  [`unload()`]（组件/卸载）|  | <p>卸载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |

