---
title: 挂件开发
description: widget.json、静态资源与 iframe 嵌入
order: 80
---

**挂件**（Widget）以 **`iframe`** 形式嵌入在编辑器文档中，源码来自工作空间 **`data/widgets/<挂件名>/`** 下的静态文件；思源将该目录映射到 URL **`/widgets/`**。

## 工作空间路径

`{工作空间}/data/widgets/<包名>/`

## 编辑器如何嵌入

在斜杆菜单选择挂件并选定某个包后，前端调用 **`hintRenderWidget`**（`app/src/protyle/hint/extend.ts`），插入类似：

```html
<iframe src="/widgets/<包名>/"
        data-subtype="widget"
        border="0" frameborder="no"
        framespacing="0" allowfullscreen="true"></iframe>
```

注意：`src` **以 `/` 结尾**，这与 Issue [#10520](https://github.com/siyuan-note/siyuan/issues/10520) 的路径约定有关。

因此挂件目录下应有可被静态服务器默认解析的首页，通常是 **`index.html`**（具体取决于 Gin Static 对目录访问的行为）；请在本地放置挂件后用浏览器或思源预览验证。

## 与插件的区别

| | 挂件 Widget | 插件 Plugin |
| --- | --- | --- |
| 入口 | 静态 HTML/JS/CSS | `index.js`，继承 `Plugin` |
| 运行环境 | iframe 内页面 | 与思源主界面同源脚本上下文 |
| 能力 | 适合独立 UI、图表；跨 iframe 与主应用通信需额外约定 | 可调 **HTTP API**、注册命令与 Dock |

若需要深度集成编辑器与数据，优先考虑 **插件**；挂件更适合独立沙箱页面。

## 下一步

- [widget.json](./manifest)
