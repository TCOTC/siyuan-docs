---
aliases: "FuzzySuggestModal"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`FuzzySuggestModal`](FuzzySuggestModal)

## FuzzySuggestModal 类

 0.9.20

**签名：**

```typescript
export abstract class FuzzySuggestModal<T> extends SuggestModal<FuzzyMatch<T>> 
```
**扩展：** [`SuggestModal`](SuggestModal)`<`[`FuzzyMatch`](FuzzyMatch)`<T>>`

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(应用程序)`](SuggestModal/(构造函数).md) |  | <p>构造 <code>SuggestModal</code> 类的新实例</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`app`]（模态/应用程序）|  | [`应用程序`]（应用程序）| <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`containerEl`](模态/containerEl) |  | <code>HTMLElement</code> | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`contentEl`](模态/contentEl) |  | <code>HTMLElement</code> | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`emptyStateText`](SuggestModal/emptyStateText) |  | <code>字符串</code> | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`inputEl`](SuggestModal/inputEl) |  | <code>HTMLInputElement</code> | <p>@<!-- -->0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`限制`]（建议模式/限制）|  | <code>号码</code> | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`modalEl`](模态/modalEl) |  | <code>HTMLElement</code> | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`resultContainerEl`](SuggestModal/resultContainerEl) |  | <code>HTMLElement</code> | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`范围`]（模态/范围）|  | [`范围`]（范围）| <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`shouldRestoreSelection`](模态/shouldRestoreSelection) |  | <code>布尔值</code> | <p> 0.9.16</p><p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`titleEl`](模态/titleEl) |  | <code>HTMLElement</code> | <p>(继承自[Modal](Modal)<!-- -->)</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`close()`]（模态/关闭）|  | <p>隐藏模态框。</p><p>（继承自 [Modal](Modal)<!-- -->)</p> |
|  [`getItems()`](FuzzySuggestModal/getItems) | <code>摘要</code> |  0.9.20 |
|  [`getItemText(item)`](FuzzySuggestModal/getItemText) | <code>摘要</code> |  0.9.20 |
|  [`getSuggestions(query)`](FuzzySuggestModal/getSuggestions) |  |  0.9.20 |
|  [`onChooseItem(item, evt)`](FuzzySuggestModal/onChooseItem) | <code>摘要</code> |  0.9.20 |
|  [`onChooseSuggestion(item, evt)`](FuzzySuggestModal/onChooseSuggestion) |  |  0.9.20 |
|  [`onClose()`](模态/onClose) |  | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`onNoSuggestion()`](SuggestModal/onNoSuggestion) |  | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`onOpen()`](模态/onOpen) |  | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`open()`]（模态/打开）|  | <p>在活动窗口上显示模式。在移动设备上，模态框将在屏幕上呈现动画。</p><p>（继承自 [Modal](Modal)<!-- -->)</p> |
|  [`renderSuggestion(item, el)`](FuzzySuggestModal/renderSuggestion) |  |  0.9.20 |
|  [`selectActiveSuggestion(evt)`](SuggestModal/selectActiveSuggestion) |  | <p> 1.7.2</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`selectSuggestion(value, evt)`](SuggestModal/selectSuggestion) |  | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`setCloseCallback(回调)`](模态/setCloseCallback) |  | <p> 1.10.0</p><p>（继承自[Modal](Modal)<!-- -->)</p> |
|  [`setContent(内容)`](模态/setContent) |  | <p>(继承自[Modal](Modal)<!-- -->)</p> |
|  [`setInstructions(说明)`](SuggestModal/setInstructions) |  | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`setPlaceholder(占位符)`](SuggestModal/setPlaceholder) |  | <p> 0.9.20</p><p>（继承自 [SuggestModal](SuggestModal)<!-- -->)</p> |
|  [`setTitle(标题)`](模态/setTitle) |  | <p>(继承自[Modal](Modal)<!-- -->)</p> |

