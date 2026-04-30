---
aliases: "DataAdapter.trashSystem"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`trashSystem`](DataAdapter/trashSystem)

## DataAdapter.trashSystem() 方法

尝试移至系统垃圾箱。

**签名：**

```typescript
trashSystem(normalizedPath: string): Promise<boolean>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件/文件夹的路径，使用 [normalizePath()](normalizePath) 预先标准化。 |

**退货：**

`承诺<布尔值>`

如果成功则返回 true。由于系统垃圾被禁用，这可能会失败。

