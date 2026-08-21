---
title: theme.json 说明
description: 主题清单字段与模式
---

每个主题在自身目录下提供 **`theme.json`**，供客户端与集市识别包信息。内置示例见思源仓库 **`app/appearance/themes/daylight/theme.json`** 与 **`midnight/theme.json`**。

## 示例（精简）

```json
{
  "name": "daylight",
  "author": "Vanessa",
  "url": "https://github.com/Vanessa219",
  "version": "1.1.2",
  "modes": ["light"]
}
```

暗色主题示例 **`midnight/theme.json`**：

```json
{
  "name": "midnight",
  "author": "Vanessa",
  "url": "https://github.com/Vanessa219",
  "version": "1.1.2",
  "modes": ["dark"]
}
```

若一套样式同时支持亮色与暗夜，可写：

```json
"modes": ["light", "dark"]
```

思源会根据 **`modes`** 把主题加入对应列表（内置 `daylight` / `midnight` 仍有特殊分支，勿以此推断第三方主题的排序细节）。

## 与插件清单的异同

主题与插件在集市侧都带有 **`name`、`author`、`url`、`version`、`minAppVersion`（若有）、`displayName`、`description`、`readme`、`funding`、`keywords`** 等通用字段；主题**特有**的是 **`modes`**（数组，元素为 **`light`** / **`dark`**），用于声明适用的配色模式。

插件使用 **`backends` / `frontends`**；主题不使用这两项。

打包体积、图标与预览图要求可参考集市发布说明；**请勿以本文作为集市校验的唯一依据**，发布前对照官方当前要求。

下一步：[样式与 CSS 变量](./styling.zh-CN.md)。
