---
aliases: "BasesConfigFileView"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesConfigFileView`](BasesConfigFileView)

## BasesConfigFileView接口

 1.10.0

**签名：**

```typescript
export interface BasesConfigFileView 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`过滤器？`](BasesConfigFileView/过滤器) |  | [`BasesConfigFileFilter`]（BasesConfigFileFilter）| <p>_（可选）_附加过滤器，仅应用于此视图。</p><p> 1.10.0</p> |
|  [`groupBy？`](BasesConfigFileView/groupBy) |  | <代码>{}</代码> | <p>_（可选）_用于对此视图的结果进行分组的配置。</p><p> 1.10.0</p> |
|  [`名称`](BasesConfigFileView/名称) |  | <code>字符串</code> | <p>此视图的友好名称，显示在 UI 中以在视图之间进行选择。</p><p> 1.10.0</p> |
|  [`顺序？`](BasesConfigFileView/顺序) |  | <code>字符串[]</code> | <p>_（可选）_要在此视图中显示的属性的有序列表。</p><p> 1.10.0</p> |
|  [`摘要？`](BasesConfigFileView/摘要) |  | <code>记录</code><code><字符串，字符串></code> | <p>_（可选）_为此视图中的每个属性显示的摘要配置。</p><p>键：属性名称。值：汇总公式名称。</p><p> 1.10.0</p> |
|  [`类型`](BasesConfigFileView/类型) |  | <code>字符串</code> | <p>视图类型的唯一标识符。用于选择正确的视图渲染器。</p><p> 1.10.0</p> |

