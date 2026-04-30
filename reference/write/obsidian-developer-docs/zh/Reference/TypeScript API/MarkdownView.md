---
aliases: "MarkdownView"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownView`](MarkdownView)

## MarkdownView 类


**签名：**

```typescript
export class MarkdownView extends TextFileView implements MarkdownFileInfo 
```**扩展：** [`TextFileView`](TextFileView)

**实现：** [`MarkdownFileInfo`](MarkdownFileInfo)

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(叶)`](MarkdownView/(构造函数).md) |  |构造 <code>MarkdownView</code> 类的新实例 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`allowNoFile`](FileView/allowNoFile) |  | <code>布尔值</code> | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`应用程序`]（视图/应用程序）|  | [`应用程序`]（应用程序）| <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`containerEl`](视图/containerEl) |  | <code>HTMLElement</code> | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`contentEl`](ItemView/contentEl) |  | <code>HTMLElement</code> | <p>（继承自 [ItemView](ItemView)<!-- -->)</p> |
|  [`currentMode`](MarkdownView/currentMode) |  | [`MarkdownSubView`](MarkdownSubView) |  |
|  [`数据`](TextFileView/数据) |  | <code>字符串</code> | <p>内存中数据</p><p> 0.10.12</p><p>（继承自 [TextFileView](TextFileView)<!-- -->)</p> |
|  [`编辑器`](MarkdownView/编辑器) |  | [`编辑器`]（编辑器）|  |
|  [`文件`](文件视图/文件) |  | [`TFile`](TFile)<代码> &#124;空</code> | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`hoverPopover`](MarkdownView/hoverPopover) |  | [`HoverPopover`](HoverPopover)<code> &#124;空</code> |  |
|  [`图标`]（视图/图标）|  | [`图标名称`](图标名称) | <p> 1.1.0</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`叶子`]（视图/叶子）|  | [`WorkspaceLeaf`](WorkspaceLeaf) | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`导航`]（文件视图/导航）|  | <code>布尔值</code> | <p>默认情况下可以导航文件视图。 </p><p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`预览模式`](MarkdownView/预览模式) |  | [`MarkdownPreviewView`](MarkdownPreviewView) |  |
|  [`requestSave`](TextFileView/requestSave) |  | <代码>() =>无效</code> | <p>从现在起 2 秒内进行去抖保存</p><p> 0.10.12</p><p>（继承自 [TextFileView](TextFileView)<!-- -->)</p> |
|  [`范围`]（视图/范围）|  | [`范围`]（范围）<代码> &#124;空</code> | <p>为您的视图分配一个可选范围，以便在视图处于焦点时注册热键。</p><p>（继承自 [View](View)<!-- -->)</p> |

＃＃ 方法|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addAction（图标，标题，回调）`](ItemView/addAction) |  | <p> 1.1.0</p><p>（继承自 [ItemView](ItemView)<!-- -->)</p> |
|  [`addChild(组件)`](组件/addChild) |  | <p>添加一个子组件，如果该组件已加载，则加载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`canAcceptExtension(扩展名)`](FileView/canAcceptExtension) |  | <p> 0.9.7</p><p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`clear()`](MarkdownView/clear) |  |  |
|  [`getDisplayText()`](FileView/getDisplayText) |  | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`getEphemeralState()`](查看/getEphemeralState) |  | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`getIcon()`](视图/getIcon) |  | <p> 1.1.0</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`getMode()`](MarkdownView/getMode) |  |  |
|  [`getState()`](FileView/getState) |  | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`getViewData()`](MarkdownView/getViewData) |  |  |
|  [`getViewType()`](MarkdownView/getViewType) |  |  |
|  [`load()`]（组件/负载）|  | <p>加载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onClose()`](查看/onClose) | <code>受保护</code> | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`onload()`](FileView/onload) |  | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`onLoadFile(文件)`](TextFileView/onLoadFile) |  | <p> 0.10.12</p><p>（继承自 [TextFileView](TextFileView)<!-- -->)</p> |
|  [`onOpen()`](查看/onOpen) | <code>受保护</code> | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`onPaneMenu(菜单，源)`](View/onPaneMenu) |  | <p>填充窗格菜单。</p><p>（替换之前删除的 <code>onHeaderMenu</code> 和 <code>onMoreOptionsMenu</code>）</p><p> 0.15.3</p><p>（继承自 [View](View)<!-- -->)</p> |
|  [`onRename(文件)`](FileView/onRename) |  | <p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`onResize()`](视图/onResize) |  | <p>当此视图的大小更改时调用。</p><p> 0.9.7</p><p>（继承自 [View](View)<!-- -->)</p> |
|  [`onunload()`](组件/onunload) |  | <p>重写此设置以卸载您的组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`onUnloadFile(文件)`](TextFileView/onUnloadFile) |  | <p> 0.10.12</p><p>（继承自 [TextFileView](TextFileView)<!-- -->)</p> |
|  [`register(cb)`]（组件/寄存器）|  | <p>注册卸载时调用的回调</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](组件/registerDomEvent) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_1) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerDomEvent(el, 类型, 回调, 选项)`](Component/registerDomEvent_2) |  | <p>注册一个卸载时要分离的DOM事件</p><p> 0.14.8</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerEvent(eventRef)`](组件/registerEvent) |  | <p>注册卸载时要分离的事件</p><p> 0.9.7</p><p>（继承自[Component](Component)<!-- -->)</p> |
|  [`registerInterval(id)`](组件/registerInterval) |  | <p>注册一个间隔（来自 setInterval），在卸载时取消使用，以避免 NodeJS 与浏览器 API 之间的 TypeScript 混淆</p><p> 0.13.8</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`removeChild(组件)`](组件/removeChild) |  | <p>删除子组件，卸载它</p><p> 0.12.0</p><p>（继承自 [Component](Component)<!-- -->)</p> |
|  [`保存（清除）`]（TextFileView/保存）|  | <p> 0.10.12</p><p>（继承自 [TextFileView](TextFileView)<!-- -->)</p> |
|  [`setEphemeralState(状态)`](视图/setEphemeralState) |  | <p> 0.9.7</p><p>(继承自[View](View)<!-- -->)</p> |
|  [`setState(状态，结果)`](FileView/setState) |  | <p> 0.9.7</p><p>（继承自 [FileView](FileView)<!-- -->)</p> |
|  [`setViewData(数据，清除)`](MarkdownView/setViewData) |  |  |
|  [`showSearch(替换)`](MarkdownView/showSearch) |  |  ||  [`unload()`]（组件/卸载）|  | <p>卸载此组件及其子组件</p><p> 0.9.7</p><p>（继承自 [Component](Component)<!-- -->)</p> |

