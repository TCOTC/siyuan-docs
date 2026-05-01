构建编辑器扩展后，您可能希望从编辑器外部与其进行通信。例如，通过 [command](../User%20interface/Commands.md) 或 [ribbon action](../User%20interface/Ribbon%20actions.md)。

您可以从 [MarkdownView](../../Reference/TypeScript%20API/MarkdownView.md) 访问 CodeMirror 6 编辑器。然而，由于 Obsidian API 实际上并不公开编辑器，因此您需要使用“@ts-expect-error”告诉 TypeScript 相信它的存在。

```ts
import { EditorView } from '@codemirror/view';

// @ts-expect-error, not typed
const editorView = view.editor.cm as EditorView;
```

## 查看插件

您可以通过 `EditorView.plugin()` 方法访问 [view plugin](./View%20plugins.md) 实例。

```ts
this.addCommand({
	id: 'example-editor-command',
	name: 'Example editor command',
	editorCallback: (editor, view) => {
		// @ts-expect-error, not typed
		const editorView = view.editor.cm as EditorView;

		const plugin = editorView.plugin(examplePlugin);

		if (plugin) {
			plugin.addPointerToSelection(editorView);
		}
	},
});
```

## 状态字段

您可以直接在编辑器视图上发送更改和 [dispatch state effects](./State%20fields.md#调度状态效果)。

```ts
this.addCommand({
	id: 'example-editor-command',
	name: 'Example editor command',
	editorCallback: (editor, view) => {
		// @ts-expect-error, not typed
		const editorView = view.editor.cm as EditorView;

		editorView.dispatch({
			effects: [
				// ...
			],
		});
	},
});
```

