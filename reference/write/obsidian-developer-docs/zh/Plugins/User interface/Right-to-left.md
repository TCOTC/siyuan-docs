---
aliases:
  - RTL
description: Obsidian supports right-to-left (RTL) languages such as Arabic, Dhivehi, Hebrew, Farsi, Syriac, and Urdu. These languages are spoken by more than 600 million people. When developing plugins and themes for Obsidian it is important consider how your interface changes will adapt to the direction of the language interface and content.
---

> [!Warning] 黑曜石 1.6 中的新增功能
> Obsidian 1.6 包含对从右到左语言的许多改进，具有镜像 UI 和混合语言支持。这些更改可能会影响主题和插件。

Obsidian 支持从右到左 (RTL) 语言，例如阿拉伯语、迪维希语、希伯来语、波斯语、叙利亚语和乌尔都语。这些语言的使用者超过 6 亿。在为 Obsidian 开发插件和主题时，重要的是要考虑您的界面更改将如何适应语言界面和内容的方向。

RTL 语言可以出现在 Obsidian 中的两个重要上下文中：应用程序界面和笔记内容。

- **应用程序界面**由黑曜石设置中选择的语言定义。如果用户选择 RTL 语言，应用程序界面会自动反转，并在“body”元素中添加“.mod-rtl”类。此外，特定的界面语言被添加到“html”元素上的“lang”属性中。
- **笔记的内容**可以用从左到右 (LTR) 语言、RTL 语言编写，或在同一笔记中混合 LTR 和 RTL 语言。 Obsidian 会自动检测编辑器中语言的方向，并为每一行添加“dir”属性。

当用户选择 RTL 语言作为界面语言，或在 Obsidian 设置中将 RTL 设置为默认编辑器方向时，`dir="rtl"` 属性将添加到编辑器中。

> [!INFO] 混合方向支持
> 请注意，许多 RTL 用户选择在界面上使用 LTR 语言，同时使用 RTL 语言编写一些笔记，或者在同一个笔记中混合使用 LTR 和 RTL 语言。

## 用户对 RTL 接口的期望

主要操作系统为 RTL 语言用户提供相反的界面。操作系统提供的用户界面组件通常是水平镜像的。不以这种方式运行的应用程序可能会让 RTL 用户感到格格不入。

以下指南为设计同时支持 LTR 和 RTL 的界面提供了有用的参考：

- [Apple RTL 人机界面指南](https://developer.apple.com/design/ human-interface-guidelines/right-to-left)
- [RTL 造型 101](https://rtlstyling.com/)
- [MDN 逻辑属性和值](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_逻辑_properties_and_values)

## 使插件和主题与语言方向无关

Obsidian 是使用 Web 技术构建的，这意味着它使用现有的 CSS 和 HTML 功能来使界面适应语言方向。

### 使用逻辑属性，避免方向属性

每当您使用 CSS 添加定位和间距时，请使用逻辑属性和值（例如“start”和“end”），而不是使用“left”和“right”等方向替代值。有关逻辑属性和值的完整列表，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_逻辑_properties_and_values)。

优先考虑逻辑属性而不是方向属性：

|属性 |定向|逻辑|
| -------------------- | ---------------- | ---------------------- |
|利润 | `左边距` | `边距内联开始` |
|                      | `右边距` | `边距内联结束` |
|衬垫| `向左填充` | `填充内联开始` |
|                      | `向右填充` | `填充内联结束` |
|边框| `边框左` | `边框内联开始` |
|                      | `边界右` | `边框内联结束` |
|绝对定位| `左` | `插入内联开始` |
|                      | `正确` | `插入内联结束` |

优先考虑逻辑值而不是方向值：

|价值观 |定向|逻辑 |
| -------------- | ------------------- | -------------------- |
|浮动| `浮动：左` | `float: 内联开始` |
|                | `浮动：右` | `浮动：内联结束` |
|文本对齐| `文本对齐：左` | `文本对齐：开始` |
|                | `文本对齐：右` | `文本对齐：结束` |

### 必要时使用后备值

某些用户可能使用不包含最新版本 Chromium 的旧版 Obsidian 安装程序。- 使用较新选择器的选择器应由“@supports”保护，以防止整个块被破坏。
- 如果有一个属性没有 100% 支持，请将规则分成 2 行。第一行应该提供后备。第二行应尝试应用新值。如果此行失败，将应用之前的样式并优雅地回退。

```css
.supported,
.unsupported {
  /* this won't run */
}

.supported {
  /* this will run */
}

.unsupported {
  /* this won't run */
}

@supports selector(:dir(*)) {
  /* will run if :dir() is supported */
}
```

## Obsidian CSS 帮助器和 RTL 规则

### 语言方向选择器

#### 全局选择器

当在**设置 → 常规**中选择 RTL 语言时，`.mod-rtl` 类将添加到“body”元素中。更改界面语言需要用户重新启动 Obsidian。

您可以使用“.mod-rtl”来设置插件或主题中界面元素的方向。例如：

```css
.mod-rtl .plugin-class {
  direction: rtl;
}
```

另外，特定的界面语言也被添加到“html”元素上的“lang”属性中。例如阿拉伯语的“lang=”ar“”。

#### 编辑器选择器

当用户在 **设置 → 常规** 中选择 RTL 界面语言，或者在 **设置 → 编辑器** 中将 RTL 设置为默认编辑器方向时，`dir="rtl"` 属性会添加到 `.markdown-source-view` 元素中。

编辑文件时，通过检测第一个强方向性字符，将“.cm-line”元素上每行的“dir”属性设置为“rtl”或“ltr”。如果不存在强方向字符，则编辑器默认为前一个强方向线的方向。

在阅读模式下，使用每个块上的 `dir="auto"` 属性自动设置行的方向。

### 图标自动镜像

Obsidian 使用 [Lucide](https://lucide.dev/) 图标库。由于几乎所有图标都是对称的或具有 LTR 偏差，因此当界面处于 RTL 模式时，Obsidian 会自动反转图标的方向。为了防止在 RTL 模式下反转特定图标，您必须显式取消设置转换。

例如，如果您希望“.left-icon”不针对 RTL 语言进行镜像：

```css
.mod-rtl svg.svg-icon.left-icon {
	transform: unset;
}
```

### 使用方向变量进行水平计算

CSS 变量 `--direction` 可用于诸如 `translateX()` 之类的计算，以便在逻辑值不可用的情况下，元素可以根据语言方向水平移动。

|变量| LTR值| RTL值|
| ------------- | ---------| ---------|
| `--方向` | `1` | `-1` |

### 为元素选择最佳的双向处理

CSS [unicode-bidi](https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi) 属性可用于确定如何处理双向内容。

在某些情况下使用“plaintext”值可能很有用。在 Obsidian UI 中，只要存在单行内容（可以是 LTR 或 RTL），就会使用“纯文本”值。例如，文件名、大纲项、工具提示、状态栏元素。这可以确保内容的正确方向，并在必要时用省略号 (...) 修剪长名称。
