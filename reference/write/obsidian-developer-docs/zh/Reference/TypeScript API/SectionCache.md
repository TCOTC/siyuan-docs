---
aliases: "SectionCache"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`SectionCache`](SectionCache)

##SectionCache接口


**签名：**

```typescript
export interface SectionCache extends CacheItem 
```**扩展：** [`CacheItem`](CacheItem)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`id？`](SectionCache/id) |  | <code>字符串 &#124;未定义</code> | _（可选）_ 此部分的块 ID（如果已定义）。 |
|  [`位置`]（缓存项/位置）|  | [`位置`]（位置）| <p>此项在注释中的位置。</p><p>（继承自 [CacheItem](CacheItem)<!-- -->)</p> |
|  [`类型`](SectionCache/类型) |  | <code>'块引用' &#124; '标注' &#124; '代码' &#124; '元素' &#124; '脚注定义' &#124; '标题' &#124; 'html' &#124; '列表' &#124; '段落' &#124; '桌子' &#124; '文本' &#124; '主题休息' &#124; 'yaml' &#124;字符串</code> |解析器生成的类型字符串。类型并不详尽，可用的类型比此处记录的类型更多。 |

