---
aliases: "Plugin.registerEditorExtension"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Plugin`](插件) › [`registerEditorExtension`](插件/registerEditorExtension)

## Plugin.registerEditorExtension() 方法

注册 CodeMirror 6 扩展。要动态重新配置插件的 cm6 扩展，应传入一个数组并动态修改。修改此数组后，调用 [Workspace.updateOptions()](Workspace/updateOptions) 将应用更改。

**签名：**

```typescript
registerEditorExtension(extension: Extension): void;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>扩展</code> | <code>扩展</code> | <p>必须是 CodeMirror 6 <code>扩展</code>，或扩展数组。</p><p> 0.12.8</p> |

**退货：**

`无效`

