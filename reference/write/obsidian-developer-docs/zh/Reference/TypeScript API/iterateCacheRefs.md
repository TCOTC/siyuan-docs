---
aliases: "iterateCacheRefs"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`iterateCacheRefs`](iterateCacheRefs)

## iterateCacheRefs() 函数

> 警告：此 API 现已过时。
> 
> 

迭代链接和嵌入。如果回调返回true，则迭代过程将被中断。

**签名：**

```typescript
export function iterateCacheRefs(cache: CachedMetadata, cb: (ref: ReferenceCache) => boolean | void): boolean;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>缓存</code> | [`缓存元数据`](缓存元数据) |  |
|  <code>cb</code> | <code>(ref: </code>[`ReferenceCache`](ReferenceCache)<code>) =>;布尔值 &#124;无效</code> |  |

**退货：**

`布尔值`

如果回调返回 true，则为 true，否则为 false。

