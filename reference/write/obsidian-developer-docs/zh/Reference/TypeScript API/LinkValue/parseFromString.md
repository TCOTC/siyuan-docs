---
aliases: "LinkValue.parseFromString"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`LinkValue`](LinkValue) › [`parseFromString`](LinkValue/parseFromString)

## LinkValue.parseFromString() 方法

根据 wikilink 语法创建一个新的 LinkValue。

**签名：**

```typescript
static parseFromString(app: App, input: string, sourcePath: string): LinkValue | null;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>应用程序</code> | [`应用程序`]（应用程序）|  |
|  <code>输入</code> | <code>字符串</code> |  |
|  <code>源路径</code> | <code>字符串</code> |  |

**退货：**

[`LinkValue`](LinkValue)` |空`

## 示例

parseFromString("\[\[欢迎\|示例链接\]\]")

 1.10.0

