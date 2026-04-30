---
aliases: "EditorSuggest.getSuggestions"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`EditorSuggest`](EditorSuggest) › [`getSuggestions`](EditorSuggest/getSuggestions)

## EditorSuggest.getSuggestions() 方法

根据此上下文生成建议项。可以是异步的，但最好是同步的。生成异步建议时，您应该传递上下文。

 17.0.12

**签名：**

```typescript
abstract getSuggestions(context: EditorSuggestContext): T[] | Promise<T[]>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>上下文</code> | [`EditorSuggestContext`](EditorSuggestContext) |  |

**退货：**

`T[]| ``承诺<T[]>`

