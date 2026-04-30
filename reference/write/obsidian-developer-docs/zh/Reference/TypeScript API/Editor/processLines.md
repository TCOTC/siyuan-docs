---
aliases: "Editor.processLines"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`编辑器`]（编辑器） › [`processLines`]（编辑器/processLines）

## Editor.processLines() 方法

 0.13.26

**签名：**

```typescript
processLines<T>(read: (line: number, lineText: string) => T | null, write: (line: number, lineText: string, value: T | null) => EditorChange | void, ignoreEmpty?: boolean): void;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>阅读</code> | <代码>（行：数字，行文本：字符串）=> T&#124;空</code> |  |
|  <code>写</code> | <code>(行：数字，行文本：字符串，值：T &#124; null) => </code>[`EditorChange`](EditorChange)<code> &#124;无效</code> |  |
|  <code>ignoreEmpty</code> | <code>布尔值</code> | _（可选）_ |

**退货：**

`无效`

