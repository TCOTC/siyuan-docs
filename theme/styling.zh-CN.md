---
title: 样式与 CSS 变量
description: 主题如何通过 --b3- 变量覆盖界面
---

思源界面大量使用 **CSS 自定义属性**。内置亮色 **`app/appearance/themes/daylight/theme.css`** 与暗色 **`midnight/theme.css`** 定义同一套 **`--b3-*`** 变量名；暗夜配色通过覆盖变量实现。第三方主题应**优先改变量**，避免复制大量组件私有选择器。

---

## 1. 变量摘录（daylight / `:root`）

下列片段摘自思源仓库 **`daylight/theme.css`**，便于快速对照；**完整列表以文件为准**。

```css
:root {
	/* 主色 */
	--b3-theme-primary: #3575f0;
	--b3-theme-primary-light: rgba(53, 117, 240, .54);
	--b3-theme-primary-lighter: rgba(53, 117, 240, .38);
	--b3-theme-primary-lightest: rgba(53, 117, 240, .12);
	--b3-theme-secondary: #ff9200;
	--b3-theme-background: #fff;
	--b3-theme-surface: #f6f6f6;
	--b3-theme-error: #d23f31;
	--b3-theme-success: #65b84d;

	/* 文字 */
	--b3-theme-on-background: #222;
	--b3-theme-on-surface: #5f6368;

	/* 字体 */
	--b3-font-size: 14px;

	/* 页面背景 */
	--b3-body-background: #EBECF0;

	/* 边框 / 圆角 */
	--b3-border-color: var(--b3-theme-surface-lighter);
	--b3-border-radius: 6px;
}
```

文件中后续还有 **列表、菜单、滚动条、提示（`--b3-tooltips-*`）、空状态、卡片** 等分组，变量数量远多于上表。

---

## 2. 按界面区域检索

在 **`theme.css`** 内搜索下列前缀可快速定位：

| 前缀 / 注释块 | 典型用途 |
| --- | --- |
| `/* 主色 */`、`--b3-theme-` | 品牌色、表面层级 |
| `/* 顶部工具栏 */`、`--b3-toolbar-` | 顶栏 |
| `/* 菜单 */`、`--b3-menu-` | 下拉与右键菜单 |
| `/* 提示 */`、`--b3-tooltips-` | 悬浮提示 |
| `/* 列表 */`、`--b3-list-` | 文件树、搜索结果列表 |

---

## 3. 推荐定制顺序

1. 调 **`--b3-theme-primary`** 与 **`--b3-theme-on-*`**，确认正文与按钮对比度。
2. 调 **`--b3-theme-background` / `--b3-body-background` / `--b3-theme-surface`**，统一层次感。
3. 最后微调边框、圆角、阴影（**`--b3-border-*`**、**`--b3-dialog-shadow`** 等）。

暗夜主题请对照 **`midnight/theme.css`**，观察同一变量在暗色下的取值规律。

---

## 4. 无障碍与对比度

避免浅色字配浅色底、或过细的灰色分割线；可用内置主题作为基准对比可读性。

---

## 5. 版本兼容

思源升级可能新增变量或废弃旧名；发行主题前请在**目标版本**的内置主题 CSS 中核对。

---

## 6. 与本文档站的区别

本静态文档站（siyuan-docs）使用自有 **`global.css`**，变量命名与客户端**不一定一致**。请以思源仓库 **`appearance/themes`** 为准。
