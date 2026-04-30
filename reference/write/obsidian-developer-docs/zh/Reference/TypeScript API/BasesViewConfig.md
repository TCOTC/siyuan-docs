---
aliases: "BasesViewConfig"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesViewConfig`](BasesViewConfig)

## BasesViewConfig 类

Bases 文件的“视图”部分中单个条目的内存中表示形式。包含用户从工具栏菜单和视图选项设置的设置和配置选项。

 1.10.0

**签名：**

```typescript
export class BasesViewConfig 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`名称`](BasesViewConfig/名称) |  | <code>字符串</code> | <p>此视图的用户友好名称。</p><p> 1.10.0</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`get(key)`](BasesViewConfig/get) |  | <p>检索 <code>BasesViewRegistration.options</code> 中公开的选项的用户配置值。</p><p> 1.10.0</p> |
|  [`getAsPropertyId(key)`](BasesViewConfig/getAsPropertyId) |  | <p>从配置中检索用户配置的值，并将其转换为 BasesPropertyId。如果配置中不存在请求的密钥，或者该值无效，则返回 null。</p><p> 1.10.0</p> |
|  [`getDisplayName(propertyId)`](BasesViewConfig/getDisplayName) |  | <p>检索所提供属性的友好名称。如果用户在基本配置中重命名了该属性，则返回该值。文件属性可能有一个返回的默认名称，否则返回删除了属性类型前缀的名称。</p><p> 1.10.0</p> |
|  [`getEvaluatedFormula(视图，键)`](BasesViewConfig/getEvaluatedFormula) |  |从配置中检索用户配置的值，将其作为当前 Base 上下文中的公式进行评估。对于嵌入式基础或侧边栏中的基础，这意味着根据当前活动文件评估公式。 |
|  [`getOrder()`](BasesViewConfig/getOrder) |  | <p>要在此视图中显示的属性的有序列表。在表中，这些可以解释为可见列的列表。顺序由用户通过属性工具栏菜单配置。</p><p> 1.10.0</p> |
|  [`getSort()`](BasesViewConfig/getSort) |  | <p>检索此视图的排序配置。排序由用户通过排序工具栏菜单进行配置。删除无效的排序配置。如果没有（有效）排序配置，则返回一个空数组。不验证属性是否存在。</p><p>请注意，来自 BasesQueryResult 的数据将被预先排序。</p><p> 1.10.0</p> |
|  [`设置（键，值）`]（BasesViewConfig /设置）|  | <p>存储视图的配置数据。视图应该首选 <code>BasesViewRegistration.options</code> 以允许用户在适当的情况下配置选项。</p><p> 1.10.0</p> |

