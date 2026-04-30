---
aliases: "BasesViewConfig.getEvaluatedFormula"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesViewConfig`](BasesViewConfig) › [`getEvaluatedFormula`](BasesViewConfig/getEvaluatedFormula)

## BasesViewConfig.getEvaluatedFormula() 方法

从配置中检索用户配置的值，将其作为当前 Base 上下文中的公式进行评估。对于嵌入式基础或侧边栏中的基础，这意味着根据当前活动文件评估公式。

**签名：**

```typescript
getEvaluatedFormula(view: BasesView, key: string): Value;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>查看</code> | [`BasesView`](BasesView) |  |
|  <code>键</code> | <code>字符串</code> |  |

**退货：**

[`值`]（值）

计算公式的 Value 结果，如果公式无效或键不存在，则为 NullValue。  1.10.2

