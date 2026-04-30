---
aliases: "DurationValue"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`持续时间值`]（持续时间值）

## DurationValue 类

[Value](Value) 包裹一个持续时间。持续时间可用于修改 [DateValue](DateValue)，或者可以通过从另一个 DateValue 中减去一个 DateValue 得到。

 1.10.0

**签名：**

```typescript
export class DurationValue extends NotNullValue 
```
**扩展：** [`NotNullValue`](NotNullValue)

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`类型`]（值/类型）| <code>静态</code> | <code>字符串</code> | <p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`addToDate(值，减)`](DurationValue/addToDate) |  | <p>修改此持续时间提供的内容。</p><p> 1.10.0</p> |
|  [`等于（其他）`]（值/等于）|  | <p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |
|  [`等于(a, b)`](值/等于) | <code>静态</code> | <p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |
|  [`fromMilliseconds(毫秒)`](DurationValue/fromMilliseconds) | <code>静态</code> | <p>从毫秒创建一个新的 DurationValue。</p><p> 1.10.0</p> |
|  [`getMilliseconds()`](DurationValue/getMilliseconds) |  | <p>将此持续时间转换为毫秒。</p><p> 1.10.0</p> |
|  [`isTruthy()`](DurationValue/isTruthy) |  |  1.10.0 |
|  [`looseEquals(其他)`](值/looseEquals) |  | <p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |
|  [`looseEquals(a, b)`](值/looseEquals) | <code>静态</code> | <p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |
|  [`parseFromString(输入)`](DurationValue/parseFromString) | <code>静态</code> | <p>使用 ISO 8601 持续时间创建新的 DurationValue。有关持续时间格式的详细信息，请参阅 [https://en.wikipedia.org/wiki/ISO\_8601\#Durations](https://en.wikipedia.org/wiki/ISO_8601#Durations)。</p><p> 1.10.0</p> |
|  [`renderTo(el, ctx)`](值/renderTo) |  | <p>将此值渲染到提供的 HTMLElement 中。</p><p> 1.10.0</p><p>（继承自 [Value](Value)<!-- -->)</p> |
|  [`toString()`](DurationValue/toString) |  |  1.10.0 |

