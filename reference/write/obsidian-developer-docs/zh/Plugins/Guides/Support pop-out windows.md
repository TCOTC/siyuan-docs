---
aliases:
  - Plugins/Guides/Supporting Pop-Out Windows
permalink: /plugins/guides/pop-out-windows
---
随着 [Obsidian v0.15.0](https://obsidian.md/changelog/2022-06-14-desktop-v0.15.0/) 的发布，桌面版 Obsidian 添加了弹出窗口功能。 

对于大多数插件来说，此功能应该是开箱即用的。但是，当您的插件在弹出窗口中呈现内容时，有些事情的工作方式会有所不同。

最重要的是，弹出窗口带有一组完全不同的全局变量。每个弹出窗口都会引入自己的“Window”对象、“Document”对象以及所有全局构造函数的新副本（例如“HTMLElement”和“MouseEvent”）。

这意味着您之前假设为全局且仅使用单个定义的一些内容现在只能在主窗口中使用。以下是一些示例：

```ts
let myElement: HTMLElement = ...;

// This will always append to the main window
document.body.appendChild(myElement);

// This will actually be false if element is in a pop-out window
if (myElement instanceof HTMLElement) {

}

element.on('click', '.my-css-class', (event) => {
    // This will be false if the event is triggered in a pop-out window
    if (event instanceof MouseEvent) {

    }
}
```

Obsidian API 包括各种帮助函数和访问器，以更好地支持弹出窗口：

- 全局“activeWindow”和“activeDocument”变量，始终指向当前焦点窗口及其文档。 
- `element.win` 和 `element.doc` getter，分别指向元素所属的 `Window` 和 `Document` 对象。
- 用于执行跨窗口兼容的“instanceof”检查的函数。使用“element.instanceOf(HTMLElement)”和“event.instanceOf(MouseEvent)”，而不是“element instanceof HTMLElement”和“event instanceof MouseEvent”。
- `HTMLElement.onWindowMigerated(callback)` 当元素被插入到与原来不同的窗口中时，它会在元素上挂钩回调。这可用于画布等复杂的渲染器，以重新初始化渲染上下文。

使用这些 API，前面的示例将如下所示：

```ts
let myElement: HTMLElement = ...;

// Bad: myElement would be added to the currently focused document, which is not necessarily the one you want
activeDocument.body.appendChild(myElement);
// Good: This will append myElement to the same window as someElement
someElement.doc.body.appendChild(myElement);

// This will work correctly in pop-out windows
if (myElement.instanceOf(HTMLElement)) {

}

element.on('click', '.my-css-class', (event) => {
    // This will work correctly in pop-out windows
    if (event.instanceOf(MouseEvent)) {

    }
}
```
