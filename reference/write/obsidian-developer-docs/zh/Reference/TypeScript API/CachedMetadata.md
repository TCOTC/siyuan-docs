---
aliases: "CachedMetadata"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`缓存元数据`]（缓存元数据）

## 缓存元数据接口


**签名：**

```typescript
export interface CachedMetadata 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`块？`]（缓存元数据/块）|  | <code>记录</code><code><字符串，</code>[`BlockCache`](BlockCache)<code>></code> | _（可选）_ |
|  [`嵌入？`](CachedMetadata/嵌入) |  | [`EmbedCache`](EmbedCache)<code>[]</code> | _（可选）_ |
|  [`footnoteRefs？`](CachedMetadata/footnoteRefs) |  | [`FootnoteRefCache`](FootnoteRefCache)<code>[]</code> | _（可选）_ 1.8.7 |
|  [`脚注？`]（缓存元数据/脚注）|  | [`FootnoteCache`](FootnoteCache)<code>[]</code> | _（可选）_ 1.6.6 |
|  [`frontmatter？`](CachedMetadata/frontmatter) |  | [`FrontMatterCache`](FrontMatterCache) | _（可选）_ |
|  [`frontmatterLinks？`](CachedMetadata/frontmatterLinks) |  | [`FrontmatterLinkCache`](FrontmatterLinkCache)<code>[]</code> | _（可选）_ 1.4.0 |
|  [`frontmatterPosition？`](CachedMetadata/frontmatterPosition) |  | [`位置`]（位置）| <p>_（可选）_ frontmatter 在文件中的位置。</p><p> 1.4.0</p> |
|  [`标题？`](CachedMetadata/标题) |  | [`HeadingCache`](HeadingCache)<code>[]</code> | _（可选）_ |
|  [`链接？`]（缓存元数据/链接）|  | [`LinkCache`](LinkCache)<code>[]</code> | _（可选）_ |
|  [`listItems？`](CachedMetadata/listItems) |  | [`ListItemCache`](ListItemCache)<code>[]</code> | _（可选）_ |
|  [`referenceLinks？`](CachedMetadata/referenceLinks) |  | [`ReferenceLinkCache`](ReferenceLinkCache)<code>[]</code> | _（可选）_ 1.8.7 |
|  [`部分？`]（缓存元数据/部分）|  | [`SectionCache`](SectionCache)<code>[]</code> | _（可选）_ 节是根级 Markdown 块，可用于划分文档。 |
|  [`标签？`](缓存元数据/标签) |  | [`TagCache`](TagCache)<code>[]</code> | _（可选）_ |

