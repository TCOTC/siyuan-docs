---
aliases: "BasesFileOption"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesFileOption`](BasesFileOption)

## BasesFileOption接口

允许从 Vault 中选择文件的文本输入。

 1.10.2

**签名：**

```typescript
export interface BasesFileOption extends BasesOption 
```
**扩展：** [`BasesOption`](BasesOption)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`默认？`](BasesFileOption/默认) |  | <code>字符串</code> | _（可选）_ 1.10.2 |
|  [`显示名称`](BasesOption/显示名称) |  | <code>字符串</code> | <p> 1.10.0</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`过滤器？`](BasesFileOption/过滤器) |  | <code>(文件: </code>[`TFile`](TFile)<code>) =>;布尔值</code> | _（可选）_ 1.10.2 |
|  [`key`](BasesOption/key) |  | <code>字符串</code> | <p> 1.10.0</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`占位符？`](BasesFileOption/占位符) |  | <code>字符串</code> | _（可选）_ 1.10.2 |
|  [`shouldHide？`](BasesOption/shouldHide) |  | <代码>() =>布尔值</code> | <p>_（可选）_ 如果提供，则在函数返回 true 时该选项将被隐藏。</p><p> 1.10.2</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`类型`](BasesFileOption/类型) |  | <code>'文件'</code> |  1.10.2 |

