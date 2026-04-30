---
aliases: "MetadataCache.on('resolve')"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [on('resolve')](MetadataCache/on('resolve').md)

## MetadataCache.on('resolve') 方法

当文件已解析为“resolvedLinks”和“unresolvedLinks”<!-- --> 时调用。有时在对文件建立索引后会发生这种情况。

**签名：**

```typescript
on(name: 'resolve', callback: (file: TFile) => any, ctx?: any): EventRef;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>名称</code> | <code>'解决'</code> |  |
|  <code>回调</code> | <code>(文件: </code>[`TFile`](TFile)<code>) =>;任何</code> |  |
|  <code>ctx</code> | <code>任意</code> | _（可选）_ |

**退货：**

[`EventRef`](EventRef)

