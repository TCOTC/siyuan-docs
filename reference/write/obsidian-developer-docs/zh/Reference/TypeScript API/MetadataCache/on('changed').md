---
aliases: "MetadataCache.on('changed')"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [on('changed')](MetadataCache/on('changed').md)

## MetadataCache.on('changed') 方法

当文件已被索引并且其（更新的）缓存现在可用时调用。

注意：出于性能原因重命名文件时不会调用此函数。您必须为这些事件挂钩保管库重命名事件。

**签名：**

```typescript
on(name: 'changed', callback: (file: TFile, data: string, cache: CachedMetadata) => any, ctx?: any): EventRef;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>名称</code> | <code>'已更改'</code> |  |
|  <code>回调</code> | <code>(文件：</code>[`TFile`](TFile)<code>，数据：字符串，缓存：</code>[`CachedMetadata`](CachedMetadata)<code>) =>任何</code> |  |
|  <code>ctx</code> | <code>任意</code> | _（可选）_ |

**退货：**

[`EventRef`](EventRef)

