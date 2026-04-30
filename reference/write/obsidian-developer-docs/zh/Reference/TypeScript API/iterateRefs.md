---
aliases: "iterateRefs"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`iterateRefs`](iterateRefs)

## iterateRefs() 函数

如果回调返回true，则迭代过程将被中断。

**签名：**

```typescript
export function iterateRefs(refs: Reference[], cb: (ref: Reference) => boolean | void): boolean;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>参考</code> | [`参考`]（参考）<code>[]</code> |  |
|  <code>cb</code> | <code>(ref: </code>[`参考`](参考)<code>) =>;布尔值 &#124;无效</code> |  |

**退货：**

`布尔值`

如果回调返回 true，则为 true，否则为 false。

