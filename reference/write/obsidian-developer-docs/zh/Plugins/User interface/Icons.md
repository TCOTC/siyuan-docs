Obsidian API 中的多个 UI 组件允许您配置随附的图标。您可以从内置图标之一中进行选择，也可以添加自己的图标。

## 浏览可用图标

浏览到 [lucide.dev](https://lucide.dev/) 以查看所有可用图标及其相应的名称。

**请注意：** 目前仅支持 v0.446.0 及之前的图标。

## 使用图标

如果您想在自定义界面中使用图标，请使用[[setIcon|setIcon()]]实用函数将图标添加到[[HTML elements|HTML element]]。以下示例将图标添加到状态栏：

```ts
import { Plugin, setIcon } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    const item = this.addStatusBarItem();
    setIcon(item, 'info');
  }
}
```

要更改图标的大小，请使用预设大小在包含图标的元素上设置 `--icon-size` [[Reference/CSS variables/Foundations/Icons|CSS variable]]：

```css
div {
  --icon-size: var(--icon-size-m);
}
```

## 添加你自己的图标

要为您的插件添加自定义图标，请使用 [[addIcon|addIcon()]] 实用程序：

```ts
import { addIcon, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    addIcon('circle', `<circle cx="50" cy="50" r="50" fill="currentColor" />`);

    this.addRibbonIcon('circle', 'Click me', () => {
      console.log('Hello, you!');
    });
  }
}
```

`addIcon` 有两个参数：

1. 唯一标识您的图标的名称。
2. 图标的 SVG 内容，没有周围的 `<svg>` 标签。

请注意，您的图标需要适合“0 0 100 100”视图框才能正确绘制。

调用“addIcon”后，您可以像使用任何内置图标一样使用该图标。

### 图标设计指南

为了与 Obsidian 界面兼容并具有凝聚力，您的图标应该[遵循 Lucide 的指南](https://lucide.dev/guide/design/icon-design-guide)：

- 图标必须设计在 24 x 24 像素的画布上
- 图标在画布内必须至少有 1 个像素的填充
- 图标的描边宽度必须为 2 像素
- 图标必须使用圆形连接
- 图标必须使用圆帽
- 图标必须使用居中笔画
- 图标中的形状（例如矩形）的边框半径必须为 2 像素
- 不同的元素之间必须有 2 个像素的间距

Lucide 还为 Illustrator、Figma 和 Inkscape 等矢量编辑器提供模板和指南。
