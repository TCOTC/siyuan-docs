---
permalink: plugins/guides/bases-view
---
Bases 是 Obsidian 中的一个核心插件，它以表格、卡片、列表等形式显示笔记的动态视图。如果您不熟悉 Bases，请在开始之前阅读[帮助文档](https://help.obsidian.md/bases)。

插件可以使用 Obsidian API 创建数据驱动基地的完全自定义视图。在本指南中，您将逐步扩展示例插件以创建列表视图的简化版本。

## 你将学到什么

完成本指南后，您将能够：

- 创建自定义[基础视图](https://help.obsidian.md/bases/views)。
- 以列表格式动态呈现注释属性中的数据。

## 先决条件

要完成本指南，您需要：

- [Git](https://git-scm.com/) 安装在您的本地计算机上。
- [Node.js](https://Node.js.org/en/about/) 的本地开发环境。
- 代码编辑器，例如 [Visual Studio Code](https://code.visualstudio.com/)。

此外，本指南将基于上一个指南中创建的示例插件构建。在开始本指南之前，请先阅读 [[Build a plugin]] 指南。

## 开始之前

开发插件时，一个错误可能会导致您的保管库发生意外更改。为了防止数据丢失，您永远不应该在主保管库中开发插件。始终使用专用于插件开发的单独库。

[创建一个空保管库](https://help.obsidian.md/Getting+started/Create+a+vault#Create+empty+vault)。

## 第 1 步：示例插件设置

在本指南中，假设您的计算机上有一个包含示例插件的目录，并且您知道如何构建插件并在 Obsidian 中对其进行测试。

为了这个列表视图插件的目的，我们可以从“MyPlugin”类中删除大部分代码，只留下“onload”函数。

```TypeScript
export default class MyPlugin extends Plugin {
  async onload() {
  }
}
```

## 步骤 2：创建并注册 Bases 视图

一旦你有了一个可以构建并加载到 Obsidian 中的空插件，你就可以开始构建一个 Bases 视图。从静态显示“Hello World”的视图开始。

```TypeScript
export const ExampleViewType = 'example-view';

export default class MyPlugin extends Plugin {
  async onload() {
    // Tell Obsidian about the new view type that this plugin provides.
    this.registerBasesView(ExampleViewType, {
      name: 'Example',
      icon: 'lucide-graduation-cap',
      factory: (controller, containerEl) => {
        return new MyBasesView(controller, containerEl)
      },
    });
  }
}

export class MyBasesView extends BasesView {
  readonly type = ExampleViewType;
  private containerEl: HTMLElement;

  constructor(controller: QueryController, parentEl: HTMLElement) {
    super(controller);
    this.containerEl = parentEl.createDiv('bases-example-view-container');
  }

  // onDataUpdated is called by Obsidian whenever there is a configuration
  // or data change in the vault which may affect your view. For now,
  // simply draw "Hello World" to screen.
  public onDataUpdated(): void {
    this.containerEl.empty();
    this.containerEl.createDiv({ text: 'Hello World' });
  }
}
```

构建您的插件，重新加载应用程序，然后创建一个新的基本文件。使用工具栏左侧的菜单，然后选择列表中视图旁边的右侧 V 形。从此菜单中，将布局更改为新创建的“示例”视图类型。

## 第三步：添加配置

您更改视图布局的菜单还可以包含视图的其他配置选项。在对“registerBasesView”的调用中添加“options”属性。

在 IDE 中，您可以查看“ViewOption”的定义以查看可用的不同控件。每个控件都会在视图配置菜单中创建一个条目，并且用户输入将自动存储在Bases配置文件中。

```typescript
export default class MyPlugin extends Plugin {
  async onload() {
    // Tell Obsidian about the new view type that this plugin provides.
    this.registerBasesView(ExampleViewType, {
      name: "Example",
      icon: 'lucide-graduation-cap',
      factory: (controller, containerEl) => {
        new MyBasesView(controller, containerEl)
      },
      options: () => ([
        {
          // The type of option. 'text' is a text input.
          type: 'text',
          // The name displayed in the settings menu.
          displayName: 'Property separator',
          // The value saved to the view settings.
          key: 'separator',
          // The default value for this option.
          default: ' - ',
        },
        // ...
    ]),
    });
  }
}
```

![[example-bases-view-configuration.gif#interface]]

## 步骤 4：显示列表项

创建新的“基础”视图的最后一步是将属性中的数据转换为您想要显示的格式。每当数据发生更改时，Obsidian 都会在视图上调用“onDataUpdated”方法。为了使此示例简单，下面的代码清除容器，并为数据集中提供的每个文件重新呈现列表条目。然而，记住 Web 开发的最佳实践很重要。未过滤的 Base 将为库中的每个文件提供一个条目，因此您的视图应该能够处理数千个条目，重用 DOM 元素，并在适当的情况下避免在屏幕外渲染。

```typescript
// Add `implements HoverParent` to enable hovering over file links.
export class MyBasesView extends BasesView implements HoverParent {

  hoverPopover: HoverPopover | null;

  // ...

  public onDataUpdated(): void {
    const { app } = this;

    // Retrieve the user configured order set in the Properties menu.
    const order = this.config.getOrder()

    // Clear entries created by previous iterations. Remember, you should
    // instead attempt element reuse when possible.
    this.containerEl.empty();

    // The property separator configured by the ViewOptions above can be
    // retrieved from the view config. Be sure to set a default value.
    const propertySeparator = String(this.config.get('separator')) || ' - ';

    // this.data contains both grouped and ungrouped versions of the data.
    // If it's appropriate for your view type, use the grouped form.
    for (const group of this.data.groupedData) {
      const groupEl = this.containerEl.createDiv('bases-list-group');
      const groupListEl = groupEl.createEl('ul', 'bases-list-group-list');

      // Each entry in the group is a separate file in the vault matching
      // the Base filters. For list view, each entry is a separate line.
      for (const entry of group.entries) {
        groupListEl.createEl('li', 'bases-list-entry', (el) => {
          let firstProp = true;
          for (const propertyName of order) {
            // Properties in the order can be parsed to determine what type
            // they are: formula, note, or file.
            const { type, name } = parsePropertyId(propertyName);
  
            // `entry.getValue` returns the evaluated result of the property
            // in the context of this entry.
            const value = entry.getValue(propertyName);
  
            // Skip rendering properties which have an empty value.
            // The list items for each file may have differing length.
            if (value.isEmpty()) continue;
  
            if (!firstProp) {
              el.createSpan({
                cls: 'bases-list-separator',
                text: propertySeparator
              });
            }
            firstProp = false;
  
            // If the `file.name` property is included in the order, render
            // it specially so that it links to that file.
            if (name === 'name' && type === 'file') {
              const fileName = String(entry.file.name);
              const linkEl = el.createEl('a', { text: fileName });
              linkEl.onClickEvent((evt) => {
                if (evt.button !== 0 && evt.button !== 1) return;
                evt.preventDefault();
                const path = entry.file.path;
                const modEvent = Keymap.isModEvent(evt);
                void app.workspace.openLinkText(path, '', modEvent);
              });
  
              linkEl.addEventListener('mouseover', (evt) => {
                app.workspace.trigger('hover-link', {
                  event: evt,
                  source: 'bases',
                  hoverParent: this,
                  targetEl: linkEl,
                  linktext: entry.file.path,
                });
              });
            }
            // For all other properties, just display the value as text.
            // In your view you may also choose to use the `Value.renderTo`
            // API to better support photos, links, icons, etc.
            else {
              el.createSpan({
                cls: 'bases-list-entry-property',
                text: value.toString()
              });
            }
          }
        });
      }
    }
  }
}
```

重建您的插件并重新加载应用程序。您的 Base 现在应该显示库中每个文件的列表项！

## 结论

恭喜您构建了您的第一个基地视图！基础是一种查看保管库中数据的强大新方法，我们迫不及待地想看看您创建的新视图。

该网站包含 Bases 的完整 API 参考。这里有几个可以开始的地方：

- [[BasesView|BasesView]]
- [[BasesViewConfig|BasesViewConfig]]
- [[BasesEntryGroup|BasesEntryGroup]]

如果您有任何疑问，请加入 [Obsidian Discord 服务器](https://discord.gg/obsidianmd) 并在“obsidian-bases”或“plugin-dev”频道中提问。
