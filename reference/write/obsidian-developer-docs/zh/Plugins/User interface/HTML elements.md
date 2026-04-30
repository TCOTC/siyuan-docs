Obsidian API 中的多个组件（例如 [[Settings]]）公开_容器元素_：

```ts
import { App, PluginSettingTab } from 'obsidian';

class ExampleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    // highlight-next-line
    let { containerEl } = this;

    // ...
  }
}
```

容器元素是“HTMLElement”对象，可以在 Obsidian 中创建自定义界面。

## 使用 `createEl()` 创建 HTML 元素

每个“HTMLElement”（包括容器元素）都公开一个“createEl()”方法，该方法在原始元素下创建一个“HTMLElement”。

例如，以下是如何在容器元素内添加“<h1>”标题元素：

```ts
containerEl.createEl('h1', { text: 'Heading 1' });
```

`createEl()` 返回对新元素的引用：

```ts
const book = containerEl.createEl('div');
book.createEl('div', { text: 'How to Take Smart Notes' });
book.createEl('small', { text: 'Sönke Ahrens' });
```

## 设置元素的样式

您可以通过在插件根目录中添加“styles.css”文件来将自定义 CSS 样式添加到您的插件中。为上一本书的示例添加一些样式：

```css title="styles.css"
.book {
  border: 1px solid var(--background-modifier-border);
  padding: 10px;
}

.book__title {
  font-weight: 600;
}

.book__author {
  color: var(--text-muted);
}
```

> [!tip]
> `--background-modifier-border` 和 `--text-muted` 是由 Obsidian 本身定义和使用的 [CSS 变量](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)。如果您将这些变量用于您的样式，即使用户有不同的主题，您的插件也会看起来很棒！ 🌈

要使 HTML 元素使用样式，请为 HTML 元素设置“cls”属性：

```ts
const book = containerEl.createEl('div', { cls: 'book' });
book.createEl('div', { text: 'How to Take Smart Notes', cls: 'book__title' });
book.createEl('small', { text: 'Sönke Ahrens', cls: 'book__author' });
```

现在看起来好多了！ 🎉

![[styles.png]]

### 条件样式

如果您想根据用户的设置或其他值更改元素的样式，请使用“toggleClass”方法：

```ts
element.toggleClass('danger', status === 'error');
```
