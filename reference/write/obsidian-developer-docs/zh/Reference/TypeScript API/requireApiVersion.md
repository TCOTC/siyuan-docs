---
aliases: "requireApiVersion"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`requireApiVersion`](requireApiVersion)

## requireApiVersion() 函数

如果 API 版本等于或高于请求的版本，则返回 true。使用它来限制需要特定 API 版本的功能，以避免在较旧的 Obsidian 版本上崩溃。

**签名：**

```typescript
export function requireApiVersion(version: string): boolean;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>版本</code> | <code>字符串</code> |  |

**退货：**

`布尔值`

