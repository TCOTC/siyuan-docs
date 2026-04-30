---
aliases: "BasesQueryResult"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesQueryResult`](BasesQueryResult)

## BasesQueryResult 类

BasesQueryResult 包含执行基本查询、应用过滤器和评估公式的所有可用信息。 “data”或“groupedData”应该由您的视图显示。

 1.10.0

**签名：**

```typescript
export class BasesQueryResult 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`数据`](BasesQueryResult/数据) |  | [`BasesEntry`](BasesEntry)<code>[]</code> | <p>数据的未分组版本，应用了用户配置的排序和限制。在适当的情况下，视图应通过使用 <code>groupedData</code> 而不是此值来支持 groupBy。</p><p> 1.10.0</p> |
|  [`groupedData`](BasesQueryResult/groupedData) | <code>只读</code> | [`BasesEntryGroup`](BasesEntryGroup)<code>[]</code> | <p>要渲染的数据，根据 groupBy 配置进行分组。如果没有配置 groupBy，则返回带有空键的单个组。</p><p> 1.10.0</p> |
|  [`属性`](BasesQueryResult/属性) | <code>只读</code> | [`BasesPropertyId`](BasesPropertyId)<code>[]</code> | <p>用户定义的可见属性。</p><p> 1.10.0</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`getSummaryValue（queryController，条目，prop，summaryKey）`]（BasesQueryResult / getSummaryValue）|  | <p>将汇总函数应用于一组条目上的单个属性。</p><p> 1.10.0</p> |

