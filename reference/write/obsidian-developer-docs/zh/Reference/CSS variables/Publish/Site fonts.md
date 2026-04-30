---
cssclasses: reference
---
要加载远程字体，我们建议使用带有“@import”的 CSS 或使用“@font-face”和绝对 URL 定义字体。 [了解更多。](https://css-tricks.com/snippets/css/using-font-face-in-css/)

例如，您可以在“publish.css”文件中使用 [Google Fonts](https://fonts.google.com/)。以下是如何使用 Poppins 字体：

```css
/* @import must always be at the top of your publish.css file */
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

body {
  --font-text-theme: 'Poppins';
}
```

## CSS 变量

Obsidian Publish 与 Obsidian 应用程序共享许多[[CSS variables]]。您可以在“body”元素上更改这些变量。

|变量|描述 |
| ------------------------ | ---------------------------------------------------------------- |
| `--字体文本大小` |页面文本的字体大小 |
| `--字体文本主题` |页面文本的字体系列 |
| `--font-monospace-theme` |代码字体系列 |
| `--字体界面主题` |导航等界面元素的字体系列|

发布特定的 CSS 变量应该在 `.published-container` 上定义。请参阅[[Build a Publish theme]]。

|变量|描述 |
| ------------------- | ------------------------------------------- |
| `--页面标题字体` | [[Site pages\|page titles]] 的字体系列 |
