---
aliases: "EmbedCache"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`嵌入缓存`](嵌入缓存)

## EmbedCache接口

 0.9.7

**签名：**

```typescript
export interface EmbedCache extends ReferenceCache 
```
**扩展：** [`ReferenceCache`](ReferenceCache)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`显示文本？`]（参考/显示文本）|  | <code>字符串</code> | <p>_（可选）_ 如果标题与链接文本不同，则可用，在 <code>[[page name&#124;display name]]</code> 的情况下，这将返回<code>显示名称</code></p><p>（继承自 [Reference](Reference)<!-- -->)</p> |
|  [`链接`]（参考/链接）|  | <code>字符串</code> | <p>链接目标。</p><p>（继承自 [Reference](Reference)<!-- -->)</p> |
|  [`原创`](参考/原创) |  | <code>字符串</code> | <p>包含文档中写入的文本。不适用于发布。</p><p>（继承自 [参考](参考)<!-- -->)</p> |
|  [`位置`]（缓存项/位置）|  | [`位置`]（位置）| <p>此项在注释中的位置。</p><p>（继承自 [CacheItem](CacheItem)<!-- -->)</p> |

