---
title: 模板语法与创作
description: .action{} 模板、可用变量与调试建议
order: 72
---

思源使用 **Go `text/template`** 处理模板 Markdown，分隔符为 **`.action{`** 与 **`}`**（实现细节见主仓库模板渲染相关源码）。

## 最小示例

某模板文件 `hello.md`：

```markdown
## .action{.title} 的备忘

当前块 ID：.action{.id}

今日任务：

- [ ] 一项
```

插入时，当前文档上下文会被填入 **`.action{.title}`**、**`.action{.id}`** 等占位（具体可用字段以 **`RenderTemplate`** 内 **`dataModel`** 为准）。

> Go 模板规则：`{}` 内是表达式；字段名与 `dataModel` 的键一致。

## 可用函数

模板在解析时会挂上 **`filesys.BuiltInTemplateFuncs`** 与 **`sql.SQLTemplateFuncs`**（见 `RenderTemplate` 实现），因此可在模板里调用文档、数据库相关辅助函数。完整列表以源码为准；复杂逻辑建议先在小型工作空间内验证。

## 与 `/api/template/renderSprig` 的关系

另有 **`/api/template/renderSprig`** 接口用于 Sprig 函数库场景（见 `API.md`）。插件或脚本若直接拼 HTTP 请求，请区分二者参数与适用场景。

## 调试建议

1. 先用最短模板验证插入链路是否通。
2. 模板报错时查看运行日志与接口返回的 **`msg`**。
3. 块 ID、笔记本权限或只读模式会导致插入失败，需在 UI 上排除。

## 延伸阅读

- HTTP API 总表：[HTTP API 与数据规范](../../plugin/plugin-http-api)
- 模板包结构：[模板包开发](./overview)
