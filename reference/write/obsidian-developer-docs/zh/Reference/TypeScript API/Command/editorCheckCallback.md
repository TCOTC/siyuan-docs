---
aliases: "Command.editorCheckCallback"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Command`](命令) › [`editorCheckCallback`](命令/editorCheckCallback)

## Command.editorCheckCallback 属性

仅当用户位于编辑器中时才会触发的命令回调。覆盖 `editorCallback`<!-- -->, `callback` 和 `checkCallback`

**签名：**

```typescript
editorCheckCallback?: (checking: boolean, editor: Editor, ctx: MarkdownView | MarkdownFileInfo) => boolean | void;
```

＃＃ 例子


```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  editorCheckCallback: (checking: boolean, editor: Editor, view: MarkdownView) => {
    const value = getRequiredValue();

    if (value) {
      if (!checking) {
        doCommand(value);
      }

      return true;
    }

    return false;
  }
});
```
 0.12.2

