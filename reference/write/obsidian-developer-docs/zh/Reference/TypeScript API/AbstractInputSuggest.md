---
aliases: "AbstractInputSuggest"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`AbstractInputSuggest`](AbstractInputSuggest)

## AbstractInputSuggest 类

附加到“<input>”元素或“<div contentEditable>”以添加预先输入支持。

 1.4.10

**签名：**

```typescript
export abstract class AbstractInputSuggest<T> extends PopoverSuggest<T> 
```
**扩展：** [`PopoverSuggest`](PopoverSuggest)`<T>`

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(app, textInputEl)`](AbstractInputSuggest/(构造函数).md) |  |接受 <code><input></code> 文本框或 contenteditable div。 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`app`](PopoverSuggest/app) |  | [`应用程序`]（应用程序）| <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`限制`](AbstractInputSuggest/限制) |  | <code>号码</code> | <p>限制一次渲染的元素数量。设置为 0 以禁用。默认为 100。</p><p> 1.4.10</p> |
|  [`范围`](PopoverSuggest/范围) |  | [`范围`]（范围）| <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`close()`](PopoverSuggest/关闭) |  | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`getSuggestions(query)`](AbstractInputSuggest/getSuggestions) | <p><code>受保护</code></p><p><code>摘要</code></p> |  1.5.7 |
|  [`getValue()`](AbstractInputSuggest/getValue) |  | <p>从输入元素获取值。</p><p> 1.4.10</p> |
|  [`onSelect(回调)`](AbstractInputSuggest/onSelect) |  | <p>注册一个回调以在用户选择建议时进行处理。</p><p> 1.4.10</p> |
|  [`open()`](PopoverSuggest/打开) |  | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`renderSuggestion(value, el)`](PopoverSuggest/renderSuggestion) | <code>摘要</code> | <p>（继承自 [PopoverSuggest](PopoverSuggest)<!-- -->)</p> |
|  [`selectSuggestion(value, evt)`](AbstractInputSuggest/selectSuggestion) |  |  1.6.6 |
|  [`setValue(值)`](AbstractInputSuggest/setValue) |  | <p>将值设置到输入元素中。</p><p> 1.4.10</p> |

