---
aliases: "MetadataCache.resolvedLinks"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [`resolvedLinks`](MetadataCache/resolvedLinks)

## MetadataCache.resolvedLinks 属性

包含所有已解析的链接。该对象将每个源文件的路径映射到具有链接计数的目标文件路径的对象。源路径和目标路径都是来自“TFile.path”的库绝对路径，并且可以与“Vault.getAbstractFileByPath(path)”<!-- --> 一起使用。

**签名：**

```typescript
resolvedLinks: Record<string, Record<string, number>>;
```
