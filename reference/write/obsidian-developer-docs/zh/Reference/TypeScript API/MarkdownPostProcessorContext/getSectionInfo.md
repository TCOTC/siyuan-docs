---
aliases: "MarkdownPostProcessorContext.getSectionInfo"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownPostProcessorContext`](MarkdownPostProcessorContext) › [`getSectionInfo`](MarkdownPostProcessorContext/getSectionInfo)

## MarkdownPostProcessorContext.getSectionInfo() 方法

获取该元素此时的section信息。仅在需要此信息之前调用此函数才能获取最新版本。在许多情况下，该函数也可能返回 null；如果你使用它，你必须准备好处理空值。

**签名：**

```typescript
getSectionInfo(el: HTMLElement): MarkdownSectionInformation | null;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>el</code> | <code>HTMLElement</code> |  |

**退货：**

[`MarkdownSectionInformation`](MarkdownSectionInformation)` |空`

