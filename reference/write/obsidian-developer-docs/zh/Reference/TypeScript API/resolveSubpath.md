---
aliases: "resolveSubpath"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`resolveSubpath`](resolveSubpath)

##resolveSubpath() 函数

将给定子路径解析为 MetadataCache 中的引用。

**签名：**

```typescript
export function resolveSubpath(cache: CachedMetadata, subpath: string): HeadingSubpathResult | BlockSubpathResult | FootnoteSubpathResult | null;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>缓存</code> | [`缓存元数据`](缓存元数据) |  |
|  <code>子路径</code> | <code>字符串</code> |  |

**退货：**

[`HeadingSubpathResult`](HeadingSubpathResult)` | `[`BlockSubpathResult`](BlockSubpathResult)` | `[`FootnoteSubpathResult`](FootnoteSubpathResult)` |空`

