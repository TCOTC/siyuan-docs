---
aliases: "MetadataCache.unresolvedLinks"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [`unresolvedLinks`](MetadataCache/unresolvedLinks)

## MetadataCache.unresolvedLinks 属性

包含所有未解析的链接。该对象将每个源文件映射到具有计数的未知目的地的对象。源路径都是Vault绝对路径，类似于`resolvedLinks`<!-- -->。

**签名：**

```typescript
unresolvedLinks: Record<string, Record<string, number>>;
```
