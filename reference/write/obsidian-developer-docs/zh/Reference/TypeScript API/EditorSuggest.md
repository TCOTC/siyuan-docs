---
aliases: "EditorSuggest"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`编辑建议`](编辑建议)

## EditorSuggest 类

 17.0.12

**签名：**

```typescript
export abstract class EditorSuggest<T> extends PopoverSuggest<T> 
```
**扩展：** [`PopoverSuggest`](PopoverSuggest)`<T>`

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(应用程序)`](EditorSuggest/(构造函数).md) |  |构造 <code>EditorSuggest</code> 类的新实例 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`app`](PopoverSuggest/app) |  | [`应用程序`]（应用程序）| <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`context`](EditorSuggest/context) |  | [`EditorSuggestContext`](EditorSuggestContext)<code> &#124;空</code> | <p>当前建议上下文，包含<code>onTrigger</code>的结果。任何时候 EditorSuggest 不应该运行时，该值都将为 null。</p><p> 0.12.17</p> |
|  [`限制`](编辑建议/限制) |  | <code>号码</code> | <p>覆盖此设置以对建议项使用不同的限制</p><p> 0.12.17</p> |
|  [`范围`](PopoverSuggest/范围) |  | [`范围`]（范围）| <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`close()`](PopoverSuggest/关闭) |  | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`getSuggestions(上下文)`](EditorSuggest/getSuggestions) | <code>摘要</code> | <p>根据此上下文生成建议项。可以是异步的，但最好是同步的。生成异步建议时，您应该传递上下文。</p><p> 0.12.17</p> |
|  [`onTrigger(光标、编辑器、文件)`](EditorSuggest/onTrigger) | <code>摘要</code> | <p>根据编辑器行和光标位置，确定此时是否应该触发此EditorSuggest。通常，您会在光标之前的当前行文本上运行正则表达式。返回 null 表示不应触发此编辑器建议。</p><p>在实现此功能时请注意性能，因为它会被频繁触发（每次按键时）。保持简单，如果确定时机不对，请尽早返回 null。</p><p> 1.1.13</p> |
|  [`open()`](PopoverSuggest/打开) |  | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`renderSuggestion(value, el)`](PopoverSuggest/renderSuggestion) | <code>摘要</code> | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`selectSuggestion(value, evt)`](PopoverSuggest/selectSuggestion) | <code>摘要</code> | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`setInstructions(说明)`](EditorSuggest/setInstructions) |  |  0.13.0 |

