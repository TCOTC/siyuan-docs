---
aliases: "DateValue.parseFromString"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DateValue`](DateValue) › [`parseFromString`](DateValue/parseFromString)

## DateValue.parseFromString() 方法

从输入字符串创建新的 DateValue。

**签名：**

```typescript
static parseFromString(input: string): DateValue | null;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>输入</code> | <code>字符串</code> | <p>ISO 8601 日期或日期时间字符串。</p><p> 1.10.0</p> |

**退货：**

[`日期值`](日期值)` |空`

## 示例

parseFromString(“2025-12-31”) parseFromString(“2025-12-31T23:59”) parseFromString(“2025-12-31T23:59:59”) parseFromString(“2025-12-31T23:59:59Z-07”)

