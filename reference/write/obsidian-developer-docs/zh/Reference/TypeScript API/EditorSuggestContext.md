---
aliases: "EditorSuggestContext"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`EditorSuggestContext`](EditorSuggestContext)

## EditorSuggestContext 接口

 17.0.12

**签名：**

```typescript
export interface EditorSuggestContext extends EditorSuggestTriggerInfo 
```
**扩展：** [`EditorSuggestTriggerInfo`](EditorSuggestTriggerInfo)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`编辑器`](EditorSuggestContext/编辑器) |  | [`编辑器`]（编辑器）|  |
|  [`结束`](EditorSuggestTriggerInfo/结束) |  | [`编辑器位置`](编辑器位置) | <p>触发文本的结束位置。用于定位弹出框。</p><p>（继承自 [EditorSuggestTriggerInfo](EditorSuggestTriggerInfo)<!-- -->)</p> |
|  [`文件`](EditorSuggestContext/文件) |  | [`TFile`](TFile) |  |
|  [`查询`](EditorSuggestTriggerInfo/查询) |  | <code>字符串</code> | <p>它们查询将用于生成建议内容的字符串（通常是开始和结束之间的文本）。</p><p>（继承自 [EditorSuggestTriggerInfo](EditorSuggestTriggerInfo)<!-- -->)</p> |
|  [`开始`](EditorSuggestTriggerInfo/开始) |  | [`编辑器位置`](编辑器位置) | <p>触发文本的起始位置。用于定位弹出框。</p><p>（继承自 [EditorSuggestTriggerInfo](EditorSuggestTriggerInfo)<!-- -->)</p> |

