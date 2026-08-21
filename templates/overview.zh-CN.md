---
title: 模板包开发
description: 安装目录、template.json 与在文档中插入
---

**模板**（Template）包用于在编辑时通过「斜杆菜单 → 模板」等入口，将一段**预置内容**插入到当前文档。内容文件放在工作空间 `data/templates` 下，由清单文件 `template.json` 声明 `Package` 元数据。

## 工作空间路径

`{工作空间}/data/templates/<包名>/`

思源会把 **`data/templates`** 通过本地 HTTP 映射到路径 **`/templates/`**，供前端或 iframe 加载资源。

## 插入流程（编辑器侧）

用户在编辑器中触发模板插入后，前端会调用 **`/api/template/render`**，传入当前上下文文档 **块 ID** 与模板文件路径 **`path`**；服务端读取模板、执行模板引擎，再把生成的 Markdown 解析为编辑器 DOM。

渲染管线实现见主仓库 **`RenderTemplate`**：模板源一般为磁盘上的 **Markdown 文件**，其中可使用 Go template 语法（分隔符为 **`.action{`** 与 **`}`**，不是默认的 `{{`）。

简化理解：

1. `path`：指向 `data/templates` 下某个 `.md` 模板文件。
2. 构造数据模型（如当前标题、`title`、`name`、`alias`、`id` 等）。
3. 执行模板 → 得到 Markdown → 解析为块树 → 插入编辑器。

> **权限**：`/api/template/render` 可能受管理员角色与只读模式约束，嵌入环境与权限策略可能随版本调整，以官方文档与行为为准。

## 模板包仓库布局（示例）

```
my-template-pack/
├── template.json
├── README.md
├── preview.png
├── icon.png
└── daily.md          # 示例模板正文，文件名自定
```

具体文件名只需与插入逻辑中能选择到的路径一致；集市 zip 需包含清单要求的文件。

## 下一步

- [template.json](./manifest.zh-CN.md)
- [模板语法与创作](./authoring.zh-CN.md)
