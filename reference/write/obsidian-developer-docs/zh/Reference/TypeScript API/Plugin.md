---
aliases: "Plugin"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`插件`]（插件）

## 插件类

 0.9.7

**签名：**

```typescript
export abstract class Plugin extends Component 
```**扩展：** [`组件`]（组件）

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(应用程序，清单)`](插件/(构造函数).md) |  |构造 <code>Plugin</code> 类的新实例 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`app`]（插件/应用程序）|  | [`应用程序`]（应用程序）|  0.9.7 |
|  [`清单`]（插件/清单）|  | [`PluginManifest`](PluginManifest) |  0.9.7 |

＃＃ 方法|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addChild(组件)`](组件/addChild) |  | <p>添加一个子组件，如果该组件已加载，则加载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`addCommand(命令)`](插件/addCommand) |  | <p>全局注册一个命令。注册的命令将可从 .命令 id 和名称将自动以该插件的 id 和名称作为前缀。</p><p> 0.9.7</p> |
|  [`addRibbonIcon（图标，标题，回调）`]（插件/addRibbonIcon）|  |将功能区图标添加到左侧栏。 |
|  [`addSettingTab(settingTab)`](插件/addSettingTab) |  |注册一个设置选项卡，允许用户更改设置。 |
|  [`addStatusBarItem()`](插件/addStatusBarItem) |  |将状态栏项目添加到应用程序的底部。不适用于移动设备。 |
|  [`load()`]（组件/负载）|  | <p>加载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`loadData()`](插件/loadData) |  |从磁盘加载设置数据。数据存储在插件文件夹中的 <code>data.json</code> 中。 |
|  [`onExternalSettingsChange()?`](插件/onExternalSettingsChange) |  | <p>_（可选）_ 当从 Obsidian 外部修改磁盘上的 <code>data.json</code> 文件时调用。这通常意味着同步服务或外部程序已修改插件设置。</p><p>实现此方法以在外部更改插件设置时重新加载插件设置。</p><p> 1.5.7</p> |
|  [`onload()`](插件/onload) |  |  0.9.7 |
|  [`onunload()`](组件/onunload) |  | <p>重写此设置以卸载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onUserEnable()`](插件/onUserEnable) |  | <p>执行任何初始设置代码。用户已明确与插件交互，因此与用户交互是安全的。如果您的插件注册了自定义视图，您可以在此处打开它。</p><p> 1.7.2</p> |
|  [`register(cb)`]（组件/寄存器）|  | <p>注册卸载时调用的回调</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerBasesView(viewId, 注册)`](插件/registerBasesView) |  |注册一个基本视图处理程序，可用于渲染属性查询中的数据。 |
|  [`registerCliHandler(命令、描述、标志、处理程序)`](插件/registerCliHandler) |  | <p>注册一个 CLI 处理程序来处理来自 CLI 的命令。命令 ID 必须是全局唯一的。尝试注册已注册的命令将引发错误。</p><p>使用 <code><plugin-id></code> 格式作为默认命令，使用 <code><plugin-id>:<action></code> 格式作为子命令和操作。</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](组件/registerDomEvent) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_1) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_2) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerEditorExtension(扩展)`](插件/registerEditorExtension) |  |注册 CodeMirror 6 扩展。要动态重新配置插件的 cm6 扩展，应传入一个数组并动态修改。修改此数组后，调用 [Workspace.updateOptions()](Workspace/updateOptions) 将应用更改。 |
|  [`registerEditorSuggest(editorSuggest)`](插件/registerEditorSuggest) |  | <p>注册一个 EditorSuggest，它可以在用户输入时提供实时建议。</p><p> 0.12.7</p> |
|  [`registerEvent(eventRef)`](组件/registerEvent) |  | <p>注册卸载时要分离的事件</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerExtensions(扩展，viewType)`](插件/registerExtensions) |  |  0.9.7 |
|  [`registerHoverLinkSource(id, info)`](插件/registerHoverLinkSource) |  | <p>使用“页面预览”核心插件将视图注册为“悬停链接”事件的发射器。</p><p> 1.1.0</p> ||  [`registerInterval(id)`](组件/registerInterval) |  | <p>注册一个间隔（来自 setInterval），在卸载时取消使用，以避免 NodeJS 与浏览器 API 之间的 TypeScript 混淆</p><p> 0.13.8</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`registerMarkdownCodeBlockProcessor(语言、处理程序、sortOrder)`](插件/registerMarkdownCodeBlockProcessor) |  |注册一个特殊的后处理器，用于处理给定语言和处理程序的隔离代码。这个特殊的后处理器负责删除 <code><pre><code></code> 并创建一个 <code><div></code> ，该 <code><div></code> 将传递给处理程序，并预计将填充自定义元素。 |
|  [`registerMarkdownPostProcessor(postProcessor, sortOrder)`](插件/registerMarkdownPostProcessor) |  |注册后处理器，以更改文档在阅读模式下的外观。 |
|  [`registerObsidianProtocolHandler(action, handler)`](插件/registerObsidianProtocolHandler) |  |注册 obsidian:// URL 的处理程序。 |
|  [`registerView(type, viewCreator)`](插件/registerView) |  |  0.9.7 |
|  [`removeChild(组件)`](组件/removeChild) |  | <p>删除子组件，卸载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`removeCommand(commandId)`](插件/removeCommand) |  | <p>从全局命令列表中手动删除命令。除非您的插件动态注册命令，否则不需要这样做。</p><p> 1.7.2</p> |
|  [`saveData(数据)`](插件/saveData) |  |将设置数据写入磁盘。数据存储在插件文件夹中的 <code>data.json</code> 中。 |
|  [`unload()`]（组件/卸载）|  | <p>卸载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |

