---
description: A checklist for theme developers to self-critique their themes.
permalink: oo/theme
aliases:
  - oo24/theme
---
## 兼容性

- [ ] 尽可能使用 CSS 变量。 [了解更多](https://docs.obsidian.md/Reference/CSS+variables/CSS+variables)。
- [ ] 不要使用 `!important`。
- [ ] 不要更改实时预览编辑器中使用的类中的垂直边距，而是使用填充。
- [ ] 如果您正在使用最新的实验性 CSS 功能，请在自述文件中提及所需的最低安装程序版本。

## 性能

- [ ] 除非绝对必要，否则不要使用`:has()`。它会导致性能问题，尤其是在 Canvas 中。
- [ ] 不要链接到字体和图像等资源。让它们留在本地。 [了解更多](https://docs.obsidian.md/Themes/App+themes/Theme+guidelines#Keep+assets+local)。


## 释放

- [ ] 不要在您的名字中包含“Obsidian”一词，除非它绝对有意义。大多数时候它是多余的。
- [ ] 请检查您的屏幕截图文件是否是最新的。这些屏幕截图在主题目录中显示为缩略图。
- [ ] 请检查您的自述文件以确保它是最新的。这是所有潜在用户在主题目录中查看您的主题时看到的内容。
- [ ] 请保持屏幕截图较小，以便在目录中加载速度更快。我们建议尺寸为 512 x 288 像素。
- [ ] 请确保您拥有适当的许可证，以便其他人知道如何使用您的主题及其源代码。