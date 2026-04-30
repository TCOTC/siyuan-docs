---
aliases: "BasesFolderOption"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesFolderOption`](BasesFolderOption)

## BasesFolderOption接口

允许从 Vault 中选择文件夹的文本输入。

 1.10.2

**签名：**

```typescript
export interface BasesFolderOption extends BasesOption 
```
**扩展：** [`BasesOption`](BasesOption)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`默认？`](BasesFolderOption/默认) |  | <code>字符串</code> | _（可选）_ 1.10.2 |
|  [`显示名称`](BasesOption/显示名称) |  | <code>字符串</code> | <p> 1.10.0</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`过滤器？`](BasesFolderOption/过滤器) |  | <code>(文件夹：</code>[`TFolder`](TFolder)<code>) =>;布尔值</code> | _（可选）_ 1.10.2 |
|  [`key`](BasesOption/key) |  | <code>字符串</code> | <p> 1.10.0</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`占位符？`](BasesFolderOption/占位符) |  | <code>字符串</code> | _（可选）_ 1.10.2 |
|  [`shouldHide？`](BasesOption/shouldHide) |  | <代码>() =>布尔值</code> | <p>_（可选）_ 如果提供，则在函数返回 true 时该选项将被隐藏。</p><p> 1.10.2</p><p>（继承自 [BasesOption](BasesOption)<!-- -->)</p> |
|  [`类型`](BasesFolderOption/类型) |  | <code>'文件夹'</code> |  1.10.2 |

