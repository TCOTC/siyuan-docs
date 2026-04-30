视图决定 Obsidian 如何显示内容。文件资源管理器、图形视图和 Markdown 视图都是视图的示例，但您也可以创建自己的自定义视图，以对您的插件有意义的方式显示内容。

要创建自定义视图，请创建一个扩展 [[ItemView|ItemView]] 接口的类：

```ts
import { ItemView, WorkspaceLeaf } from 'obsidian';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'Example view';
  }

  async onOpen() {
    const container = this.contentEl;
    container.empty();
    container.createEl('h4', { text: 'Example view' });
  }

  async onClose() {
    // Nothing to clean up.
  }
}
```

> [!note]
> 有关如何使用`createEl()`方法的更多信息，请参阅[[HTML elements]]。

每个视图均由文本字符串唯一标识，并且多个操作要求您指定要使用的视图。将其提取为常量“VIEW_TYPE_EXAMPLE”是一个好主意 - 正如您将在本指南后面看到的那样。

- `getViewType()` 返回视图的唯一标识符。
- `getDisplayText()` 返回视图的人类可读名称。
- 当视图在新叶子中打开时调用“onOpen()”，并负责构建视图的内容。
- `onClose()` 在视图应该关闭时调用，并负责清理视图使用的任何资源。

启用插件时需要注册自定义视图，禁用插件时需要清除自定义视图：

```ts
import { Plugin, WorkspaceLeaf } from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from './view';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon('dice', 'Activate view', () => {
      this.activateView();
    });
  }

  async onunload() {
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for it
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}
```

[[registerView|registerView()]] 的第二个参数是一个工厂函数，它返回要注册的视图的实例。

> [!warning]
> 切勿在插件中管理对视图的引用。 Obsidian 可能会多次调用视图工厂函数。避免视图中的副作用，并在需要访问视图实例时使用 getLeavesOfType() 。
>
>```ts
> this.app.workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE).forEach((leaf) => {
>   if (leaf.view instanceof ExampleView) {
>     // Access your view instance.
>   }
> });
> ```
