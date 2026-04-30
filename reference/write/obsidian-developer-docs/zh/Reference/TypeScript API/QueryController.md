---
aliases: "QueryController"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`查询控制器`](查询控制器)

## 查询控制器类

负责执行 Bases 查询并评估过滤器和公式。通知视图更新结果。

 1.10.0

**签名：**

```typescript
export class QueryController extends Component 
```**扩展：** [`组件`]（组件）

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

