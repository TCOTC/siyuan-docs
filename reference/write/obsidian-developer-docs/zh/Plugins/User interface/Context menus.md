如果您想打开上下文菜单，请使用[[Menu|Menu]]：

```ts
import { Menu, Notice, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('dice', 'Open menu', (event) => {
      const menu = new Menu();

      menu.addItem((item) =>
        item
          .setTitle('Copy')
          .setIcon('documents')
          .onClick(() => {
            new Notice('Copied');
          })
      );

      menu.addItem((item) =>
        item
          .setTitle('Paste')
          .setIcon('paste')
          .onClick(() => {
            new Notice('Pasted');
          })
      );

      menu.showAtMouseEvent(event);
    });
  }
}
```

[[showAtMouseEvent|showAtMouseEvent()]] 打开您用鼠标单击的菜单。

> [!tip]
> 如果您需要更多地控制菜单的显示位置，可以使用 `menu.showAtPosition({ x: 20, y: 20 })` 在相对于 Obsidian 窗口左上角的位置打开菜单。

有关可以使用哪些图标的更多信息，请参阅[[Plugins/User interface/Icons|Icons]]。

您还可以通过订阅“file-menu”和“editor-menu”工作区事件将项目添加到文件菜单或编辑器菜单：

![[context-menu-positions.png]]

```ts
import { Notice, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerEvent(
      this.app.workspace.on('file-menu', (menu, file) => {
        menu.addItem((item) => {
          item
            .setTitle('Print file path 👈')
            .setIcon('document')
            .onClick(async () => {
              new Notice(file.path);
            });
        });
      })
    );

    this.registerEvent(
      this.app.workspace.on("editor-menu", (menu, editor, view) => {
        menu.addItem((item) => {
          item
            .setTitle('Print file path 👈')
            .setIcon('document')
            .onClick(async () => {
              new Notice(view.file.path);
            });
        });
      })
    );
  }
}
```

有关处理事件的更多信息，请参阅[[Events]]。
