---
aliases: "ListItemCache.parent"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`ListItemCache`](ListItemCache) › [`parent`](ListItemCache/parent)

## ListItemCache.parent 属性

父列表项的行号（position.start.line）。如果该项目没有父项（例如，它是根级别列表），则该值是第一个列表项（列表的开头）的行号的负数。

可用于推断哪些列表项属于同一组（item1.parent === item2.parent）。可用于重建层次结构信息（parentItem.position.start.line === childItem.parent）。

**签名：**

```typescript
parent: number;
```
