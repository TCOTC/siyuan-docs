---
aliases: "EditorSuggest.onTrigger"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`EditorSuggest`](EditorSuggest) › [`onTrigger`](EditorSuggest/onTrigger)

## EditorSuggest.onTrigger() 方法

根据编辑器行和光标位置，确定此时是否应该触发此EditorSuggest。通常，您会在光标之前的当前行文本上运行正则表达式。返回 null 表示不应触发此编辑器建议。

实现此功能时请注意性能，因为它会被频繁触发（每次按键时）。保持简单，如果确定现在不是正确的时间，请尽早返回 null。

 1.1.13

**签名：**

```typescript
abstract onTrigger(cursor: EditorPosition, editor: Editor, file: TFile | null): EditorSuggestTriggerInfo | null;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>光标</code> | [`编辑器位置`](编辑器位置) |  |
|  <code>编辑器</code> | [`编辑器`]（编辑器）|  |
|  <code>文件</code> | [`TFile`](TFile)<代码> &#124;空</code> |  |

**退货：**

[`EditorSuggestTriggerInfo`](EditorSuggestTriggerInfo)` |空`

