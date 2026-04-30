---
aliases: "DataAdapter.stat"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`stat`](DataAdapter/stat)

## DataAdapter.stat() 方法

检索有关给定文件/文件夹的元数据。

**签名：**

```typescript
stat(normalizedPath: string): Promise<Stat | null>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> | <p>文件/文件夹路径，使用[normalizePath()](normalizePath)预先规范化。</p><p> 0.12.2</p> |

**退货：**

`Promise<`[`Stat`](Stat)` |空>`

