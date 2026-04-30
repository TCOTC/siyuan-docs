---
aliases: "Command.editorCallback"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Command`](命令) › [`editorCallback`](命令/editorCallback)

## Command.editorCallback 属性

仅当用户位于编辑器中时才会触发的命令回调。覆盖`callback`和`checkCallback`

**签名：**

```typescript
editorCallback?: (editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => any;
```

＃＃ 例子


```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  editorCallback: (editor: Editor, view: MarkdownView) => {
    const sel = editor.getSelection();

    console.log(`You have selected: ${sel}`);
  }
});
```
 0.12.2

