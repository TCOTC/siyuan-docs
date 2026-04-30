---
aliases: "DataAdapter.list"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`list`](DataAdapter/list)

## DataAdapter.list() 方法

检索给定文件夹内所有文件和文件夹的列表，非递归。

**签名：**

```typescript
list(normalizedPath: string): Promise<ListedFiles>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件夹路径，使用 [normalizePath()](normalizePath) 预先标准化。 |

**退货：**

`Promise<`[`ListedFiles`](ListedFiles)`>`

