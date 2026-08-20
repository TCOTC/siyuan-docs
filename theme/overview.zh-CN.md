---
title: 主题开发概览
description: 主题包位置、与插件的区别及加载方式
---

思源**主题**用于覆盖界面外观：颜色、字体、间距、圆角等，主要通过 **CSS**（及可选脚本，见下文）实现。主题不改变笔记本数据模型；需要交互逻辑、调用 **HTTP API** 时应编写**插件**。

## 主题目录结构（示例）

```text
appearance/themes/my-theme/
├── theme.json          # 必需：清单
├── theme.css           # 常见样式入口
├── theme.js            # 可选（上架策略请以集市为准）
├── preview.png         # 集市预览（发布需要）
├── icon.png
└── README.md
```

本地路径：

**`{工作空间}/appearance/themes/<主题目录名>/`**

内置 **`daylight`**、**`midnight`** 也可在该目录下与用户主题并存。

---

## theme.json 与列表展示

思源启动时会扫描各主题子目录下的 **`theme.json`**，并根据 **`modes`** 把主题归入亮色列表或暗色列表（内置 `daylight` / `midnight` 有特殊处理）。展示名可来自 **`displayName`** 的多语言字段。

---

## 样式入口

常见文件名为 **`theme.css`**（内置 `daylight`、`midnight` 使用此名）。变量命名大量使用 **`--b3-`** 前缀，见 [样式与 CSS 变量](./styling)。

---

## theme.js（可选）

历史上部分主题可附带 **`theme.js`**；集市可能对「新上架主题不得包含脚本」等有额外校验。**新主题优先使用 CSS 变量完成配色**，脚本仅作为最后手段。

---

## 与插件的协作

主题负责统一视觉：**CSS 变量 + `.b3-*` 组件类名**。插件注入 DOM 时应优先读 **`getComputedStyle`** 里的变量或沿用官方类名，避免写死某一个主题的十六进制颜色。

---

## 下一步

- [theme.json](./manifest)
- [样式与 CSS 变量](./styling)
