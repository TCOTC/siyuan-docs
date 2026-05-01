视图插件是一个 [editor extension](./Editor%20extensions.md)，可让您访问编辑器 [Viewport](./Viewport.md)。

> [!note]
> 本页面旨在为 Obsidian 插件开发人员提炼官方 CodeMirror 6 文档。有关状态管理的更多信息，请参阅[影响视图](https://codemirror.net/docs/guide/#affecting-the-view)。

## 先决条件

- 对 [Viewport](./Viewport.md) 的基本了解。

## 创建视图插件

视图插件是在视口重新计算后运行的编辑器扩展。虽然这意味着他们可以访问视口，但也意味着视图插件无法进行任何会影响视口的更改。例如，通过在文档中插入块或换行符。

> [!tip]
> 如果您想要进行影响编辑器垂直布局的更改（例如插入块和换行符），则需要使用 [state field](./State%20fields.md)。

要创建视图插件，请创建一个实现 [PluginValue](https://codemirror.net/docs/ref/#view.PluginValue) 的类并将其传递给 [ViewPlugin.fromClass()](https://codemirror.net/docs/ref/#view.ViewPlugin^fromClass) 函数。

```ts
import {
  ViewUpdate,
  PluginValue,
  EditorView,
  ViewPlugin,
} from '@codemirror/view';

class ExamplePlugin implements PluginValue {
  constructor(view: EditorView) {
    // ...
  }

  update(update: ViewUpdate) {
    // ...
  }

  destroy() {
    // ...
  }
}

export const examplePlugin = ViewPlugin.fromClass(ExamplePlugin);
```

视图插件的三个方法控制其生命周期：

- `constructor()` 初始化插件。
- 当某些内容发生更改时，例如当用户输入或选择某些文本时，“update()”会更新您的插件。
- `destroy()` 在插件之后清理。

虽然示例中的视图插件可以工作，但它并没有做太多事情。如果您想更好地了解导致插件更新的原因，可以将 `console.log(update);` 行添加到 `update()` 方法中，以将所有更新打印到控制台。

## 后续步骤

从您的视图插件中提供 [Decorations](./Decorations.md) 来更改文档的显示方式。
