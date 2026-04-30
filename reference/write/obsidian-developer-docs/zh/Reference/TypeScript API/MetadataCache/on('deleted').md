---
aliases: "MetadataCache.on('deleted')"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [on('已删除')](MetadataCache/on('已删除').md)

## MetadataCache.on('已删除') 方法

当文件被删除时调用。提供了缓存元数据的尽力而为的先前版本，但如果文件先前未成功缓存，则它可能为空。

**签名：**

```typescript
on(name: 'deleted', callback: (file: TFile, prevCache: CachedMetadata | null) => any, ctx?: any): EventRef;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>名称</code> | <code>'已删除'</code> |  |
|  <code>回调</code> | <code>(文件: </code>[`TFile`](TFile)<code>, prevCache: </code>[`CachedMetadata`](CachedMetadata)<code> &#124; null) =>;任何</code> |  |
|  <code>ctx</code> | <code>任意</code> | _（可选）_ |

**退货：**

[`EventRef`](EventRef)

