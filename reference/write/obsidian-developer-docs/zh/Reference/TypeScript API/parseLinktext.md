---
aliases: "parseLinktext"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`parseLinktext`](parseLinktext)

## parseLinktext() 函数

将 wiki 链接的链接文本解析为其组成部分。

**签名：**

```typescript
export function parseLinktext(linktext: string): {
    path: string;
    subpath: string;
};
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>链接文本</code> | <code>字符串</code> |没有前导 \[\[ 和尾随 \]\] 的 wiki 链接 |

**退货：**

`{ 路径：字符串；     子路径：字符串； }`

文件路径和子路径（子路径可以指块 ID 或标题）

