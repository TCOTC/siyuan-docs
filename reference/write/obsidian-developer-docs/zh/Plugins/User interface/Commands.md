命令是用户可以从[命令面板](https://help.obsidian.md/Plugins/Command+palette) 或使用热键调用的操作。

![[command.png]]

要为您的插件注册新命令，请调用 `onload()` 方法内的 [[addCommand|addCommand()]] 方法：

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addCommand({
      id: 'print-greeting-to-console',
      name: 'Print greeting to console',
      callback: () => {
        console.log('Hey, you!');
      },
    });
  }
}
```

## 条件命令

如果您的命令只能在特定条件下运行，请考虑使用 [[checkCallback|checkCallback()]]。

`checkCallback` 运行两次。首先，进行初步检查以确定该命令是否可以运行。二是落实行动。

由于两次运行之间可能会经过一段时间，因此您需要在两次调用期间执行检查。

为了确定回调是否应该执行初步检查或操作，将“checking”参数传递给回调。

- 如果“checking”设置为“true”，则执行初步检查。
- 如果“checking”设置为“false”，则执行操作。

以下示例中的命令取决于所需的值。在两次运行中，回调都会检查该值是否存在，但仅在“checking”为“false”时才执行操作。

```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  // highlight-next-line
  checkCallback: (checking: boolean) => {
    const value = getRequiredValue();

    if (value) {
      if (!checking) {
        doCommand(value);
      }

      return true
    }

    return false;
  },
});
```

## 编辑器命令

如果您的命令需要访问编辑器，您还可以使用 [[editorCallback|editorCallback()]]，它提供活动编辑器及其视图作为参数。

```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  editorCallback: (editor: Editor, view: MarkdownView) => {
    const sel = editor.getSelection()

    console.log(`You have selected: ${sel}`);
  },
}
```

> [!note]
> 仅当存在可用的活动编辑器时，编辑器命令才会出现在命令面板中。

如果编辑器回调只能在某些条件下运行，请考虑使用 [[editorCheckCallback|editorCheckCallback()]] 代替。如需了解更多信息，请参阅[[#Conditional commands]]。

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

      return true
    }

    return false;
  },
});
```

## 热键

用户可以使用键盘快捷键或_热键_运行命令。虽然他们可以自己配置，但您也可以提供默认热键。

> [!warning]
> 避免为您打算供其他人使用的插件设置默认热键。热键很可能与其他插件或用户自己定义的热键发生冲突。

在此示例中，用户可以通过同时按住 Ctrl（或 Mac 上的 Cmd）和 Shift，然后按键盘上的字母“a”来运行命令。

```ts
this.addCommand({
  id: 'example-command',
  name: 'Example command',
  hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'a' }],
  callback: () => {
    console.log('Hey, you!');
  },
});
```

> [!note]
> Mod 键是一个特殊的修饰键，在 Windows 和 Linux 上变为 Ctrl，在 macOS 上变为 Cmd。
