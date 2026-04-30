---
aliases: "DataAdapter.copy"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`copy`](DataAdapter/copy)

## DataAdapter.copy() 方法

创建文件的副本。如果 `normalizedNewPath`<!-- --> 处已经有一个文件，则此操作将会失败。

**签名：**

```typescript
copy(normalizedPath: string, normalizedNewPath: string): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>规范化NewPath</code> | <code>字符串</code> |文件路径，使用 [normalizePath()](normalizePath) 预先标准化。 |

**退货：**

`承诺<无效>`

