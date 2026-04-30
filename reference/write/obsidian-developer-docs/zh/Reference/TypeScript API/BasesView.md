---
aliases: "BasesView"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesView`](BasesView)

## BasesView 类

插件可以创建一个类来扩展它以呈现 Base。插件应该创建一个函数，然后调用“plugin.registerView”来注册视图工厂。

 1.10.0

**签名：**

```typescript
export abstract class BasesView extends Component 
```
**扩展：** [`组件`]（组件）

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(控制器)`](BasesView/(构造函数).md) | <code>受保护</code> |  1.10.0 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`allProperties`](BasesView/allProperties) |  | [`BasesPropertyId`](BasesPropertyId)<code>[]</code> | <p>数据集中的所有可用属性。</p><p> 1.10.0</p> |
|  [`app`](BasesView/app) |  | [`应用程序`]（应用程序）|  1.10.0 |
|  [`配置`](BasesView/配置) |  | [`BasesViewConfig`](BasesViewConfig) | <p>此视图的配置对象。</p><p> 1.10.0</p> |
|  [`数据`](BasesView/数据) |  | [`BasesQueryResult`](BasesQueryResult) | <p>执行基本查询、应用过滤器和评估公式的最新输出。当 Vault 或 Bases 配置发生更改时，此对象将被新的结果集替换，因此视图不应保留对其的引用。另请注意，将重新创建所包含的 BasesEntry 对象。</p><p> 1.10.0</p> |
|  [`类型`](BasesView/类型) | <code>摘要</code> | <code>字符串</code> | <p>此视图的类型 ID</p><p> 1.10.0</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addChild(组件)`](组件/addChild) |  | <p>添加一个子组件，如果该组件已加载，则加载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`createFileForView(baseFileName, frontmatterProcessor)`](BasesView/createFileForView) |  | <p>使用提供的文件名显示文件的新注释菜单，并可选择修改 frontmatter 的功能。</p><p> 1.10.2</p> |
|  [`load()`]（组件/负载）|  | <p>加载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onDataUpdated()`](BasesView/onDataUpdated) | <code>摘要</code> | <p>当查询有新数据时调用。此视图应使用更新的数据重新呈现。</p><p> 1.10.0</p> |
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

