---
aliases: "ObjectValue.get"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`ObjectValue`](ObjectValue) › [`get`](ObjectValue/get)

## ObjectValue.get() 方法

**签名：**

```typescript
get(key: string): Value | null;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>键</code> | <code>字符串</code> |  |

**退货：**

[`值`]（值）` |空`

与提供的键关联的 [Value](Value)，或 [NullValue](NullValue)<!-- -->。如果对象中引用的属性不是 Value，则在返回之前会对其进行包装。

 1.10.0

