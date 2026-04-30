[[Reference/TypeScript API/Editor|Editor]] 类公开在编辑模式下读取和操作活动 Markdown 文档的操作。

如果您想通过命令访问编辑器，请使用[[Commands#Editor commands|editorCallback]]。

如果您想在其他地方使用编辑器，可以从活动视图访问它：

```ts
const view = this.app.workspace.getActiveViewOfType(MarkdownView);

// Make sure the user is editing a Markdown file.
if (view) {
	const cursor = view.editor.getCursor();

	// ...
}
```

> [!note]
> Obsidian 使用 [CodeMirror](https://codemirror.net/) (CM) 作为底层文本编辑器，并将 CodeMirror 编辑器作为 API 的一部分公开。 “编辑器”作为 CM6 和 CM5 之间功能桥接的抽象（旧版编辑器，仅在桌面上可用）。通过使用“Editor”而不是直接访问 CodeMirror 实例，您可以确保您的插件可以在两个平台上运行。

## 在光标位置插入文本

[[replaceRange|replaceRange()]] 方法替换两个光标位置之间的文本。如果您只给它一个位置，它会在该位置和下一个位置之间插入新文本。

以下命令在光标位置插入今天的日期：

```ts
import { Editor, moment, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'insert-todays-date',
      name: 'Insert today\'s date',
      editorCallback: (editor: Editor) => {
        editor.replaceRange(
          moment().format('YYYY-MM-DD'),
          editor.getCursor()
        );
      },
    });
  }
}
```

![[editor-todays-date.gif]]

## 替换当前选择

如果要修改所选文本，请使用[[replaceSelection|replaceSelection()]]将当前选择替换为新文本。

以下命令读取当前选择并将其转换为大写：

```ts
import { Editor, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'convert-to-uppercase',
      name: 'Convert to uppercase',
      editorCallback: (editor: Editor) => {
        const selection = editor.getSelection();
        editor.replaceSelection(selection.toUpperCase());
      },
    });
  }
}
```

![[editor-uppercase.gif]]
