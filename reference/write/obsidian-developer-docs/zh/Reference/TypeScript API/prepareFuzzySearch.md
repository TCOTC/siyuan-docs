---
aliases: "prepareFuzzySearch"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`prepareFuzzySearch`](prepareFuzzySearch)

## 准备FuzzySearch() 函数

构造在目标字符串上运行的模糊搜索回调。如果您运行搜索超过几千次，性能可能会成为问题。如果性能是一个问题，请考虑使用“prepareSimpleSearch”。

**签名：**

```typescript
export function prepareFuzzySearch(query: string): (text: string) => SearchResult | null;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>查询</code> | <code>字符串</code> |模糊查询。  fn - 应用搜索的回调函数。 |

**退货：**

`(文本：字符串) => `[`SearchResult`](SearchResult)` |空`

