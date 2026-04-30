---
aliases: "MarkdownPostProcessor"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MarkdownPostProcessor`](MarkdownPostProcessor)

## MarkdownPostProcessor 接口

后处理器接收一个元素，该元素是预览的一部分。

后处理器可以改变 DOM 以渲染各种内容，例如美人鱼图、乳胶方程或自定义控件。

如果您的后处理器需要生命周期管理，例如，当从应用程序中删除此元素时清除间隔、终止子进程等，请查看 [MarkdownPostProcessorContext.addChild()](MarkdownPostProcessorContext/addChild)

 12.0.10

**签名：**

```typescript
export interface MarkdownPostProcessor 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`sortOrder？`](MarkdownPostProcessor/sortOrder) |  | <code>号码</code> | _（可选）_ 可选的整数排序顺序。默认为 0。较小的数字在较大的数字之前运行。 |

