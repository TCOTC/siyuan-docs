---
aliases: "DataAdapter.rename"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`rename`](DataAdapter/rename)

## DataAdapter.rename() 方法

重命名文件或文件夹。

**签名：**

```typescript
rename(normalizedPath: string, normalizedNewPath: string): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件/文件夹的当前路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>规范化NewPath</code> | <code>字符串</code> |文件/文件夹的新路径，使用 [normalizePath()](normalizePath) 预先标准化。 |

**退货：**

`承诺<无效>`

