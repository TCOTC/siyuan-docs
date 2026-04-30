---
aliases: "MarkdownPostProcessorContext"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownPostProcessorContext`](MarkdownPostProcessorContext)

## MarkdownPostProcessorContext 接口


**签名：**

```typescript
export interface MarkdownPostProcessorContext 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`docId`](MarkdownPostProcessorContext/docId) |  | <code>字符串</code> |  |
|  [`frontmatter`](MarkdownPostProcessorContext/frontmatter) |  | <code>任何&#124;空&#124;未定义</code> |  |
|  [`sourcePath`](MarkdownPostProcessorContext/sourcePath) |  | <code>字符串</code> |关联文件的路径。任何链接都被假定为相对于 <code>sourcePath</code>。 |

## 方法

|  方法|描述 |
|  --- | --- |
|  [`addChild(child)`](MarkdownPostProcessorContext/addChild) | <p>添加一个子组件，其生命周期由渲染器管理。</p><p>使用此组件将一个依赖子组件添加到渲染器，这样如果子组件的 containerEl 被删除，将调用组件的卸载。</p> |
|  [`getSectionInfo(el)`](MarkdownPostProcessorContext/getSectionInfo) |获取该元素此时的section信息。仅在需要此信息之前调用此函数才能获取最新版本。在许多情况下，该函数也可能返回 null；如果你使用它，你必须准备好处理空值。 |

