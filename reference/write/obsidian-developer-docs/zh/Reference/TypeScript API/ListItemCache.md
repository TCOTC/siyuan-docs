---
aliases: "ListItemCache"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`ListItemCache`](ListItemCache)

## ListItemCache接口


**签名：**

```typescript
export interface ListItemCache extends CacheItem 
```
**扩展：** [`CacheItem`](CacheItem)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`id？`](ListItemCache/id) |  | <code>字符串 &#124;未定义</code> | _（可选）_ 此列表项的块 ID（如果已定义）。 |
|  [`父级`](ListItemCache/父级) |  | <code>号码</code> | <p>父列表项的行号（position.start.line）。如果该项目没有父项（例如，它是根级别列表），则该值是第一个列表项（列表的开头）的行号的负数。</p><p>可用于推断哪些列表项属于同一组（item1.parent === item2.parent）。可用于重建层次结构信息（parentItem.position.start.line === childItem.parent）。</p> |
|  [`位置`]（缓存项/位置）|  | [`位置`]（位置）| <p>此项在注释中的位置。</p><p>（继承自 [CacheItem](CacheItem)<!-- -->)</p> |
|  [`任务？`](ListItemCache/任务) |  | <code>字符串 &#124;未定义</code> | _（可选）_ 指示任务已检查状态的单个字符。空格字符 <code>' '</code> 被解释为不完整的任务。任何其他字符都被解释为已完成的任务。 <code>未定义</code> 如果此项不是任务。 |

