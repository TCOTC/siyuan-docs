---
aliases: "BasesViewConfig.getSort"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesViewConfig`](BasesViewConfig) › [`getSort`](BasesViewConfig/getSort)

## BasesViewConfig.getSort() 方法

检索此视图的排序配置。排序由用户通过排序工具栏菜单进行配置。删除无效的排序配置。如果没有（有效）排序配置，则返回一个空数组。不验证属性是否存在。

请注意，来自 BasesQueryResult 的数据将被预排序。

 1.10.0

**签名：**

```typescript
getSort(): BasesSortConfig[];
```
**退货：**

[`BasesSortConfig`](BasesSortConfig)`[]`

