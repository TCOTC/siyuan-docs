---
aliases: "DataAdapter.exists"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`exists`](DataAdapter/exists)

## DataAdapter.exists() 方法

检查给定路径中是否存在某些内容。要以更快的方式同步检查注释或附件是否在 Vault 中，请使用 [Vault.getAbstractFileByPath()](Vault/getAbstractFileByPath)<!-- -->。

**签名：**

```typescript
exists(normalizedPath: string, sensitive?: boolean): Promise<boolean>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件/文件夹的路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>敏感</code> | <code>布尔值</code> | _（可选）_ 某些文件系统/操作系统不区分大小写，设置为 true 以强制进行区分大小写检查。 |

**退货：**

`承诺<布尔值>`

