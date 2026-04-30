---
aliases: "BasesPropertyType"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesPropertyType`](BasesPropertyType)

## BasesPropertyType 类型

Base 中属性的三个有效“来源”。

- `note`<!-- -->: Vault 中 Markdown 文件的 frontmatter 属性。 - `formula`<!-- -->：通过评估基本配置文件中的公式计算出的属性。 - `file`<!-- -->: 文件固有的属性，例如名称、扩展名、大小等。

 1.10.0

**签名：**

```typescript
export type BasesPropertyType = 'note' | 'formula' | 'file';
```
