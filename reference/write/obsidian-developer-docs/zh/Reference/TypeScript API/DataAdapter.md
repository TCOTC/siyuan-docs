---
aliases: "DataAdapter"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`数据适配器`]（数据适配器）

## 数据适配器接口

直接处理 Vault 内的文件和文件夹。如果可能的话，更喜欢使用 [Vault](Vault) API。

**签名：**

```typescript
export interface DataAdapter 
```

## 方法

|  方法|描述 |
|  --- | --- |
|  [`追加（规范化路径，数据，选项）`]（DataAdapter /追加）|将文本添加到纯文本文件的末尾。 |
|  [`appendBinary(标准化路径，数据，选项)`](DataAdapter/appendBinary) |将数据添加到二进制文件的末尾。 |
|  [`复制（标准化路径，标准化新路径）`]（数据适配器/复制）|创建文件的副本。如果 <code>normalizedNewPath</code> 处已存在文件，则此操作将会失败。 |
|  [`存在（规范化路径，敏感）`]（DataAdapter /存在）|检查给定路径中是​​否存在某些内容。要以更快的方式同步检查注释或附件是否在 Vault 中，请使用 [Vault.getAbstractFileByPath()](Vault/getAbstractFileByPath)<!-- -->。 |
|  [`getName()`](DataAdapter/getName) |  |
|  [`getResourcePath(标准化路径)`](DataAdapter/getResourcePath) |返回供浏览器引擎使用的 URI，例如嵌入图像。 |
|  [`列表（规范化路径）`]（数据适配器/列表）|检索给定文件夹内所有文件和文件夹的列表，非递归。 |
|  [`mkdir(标准化路径)`](DataAdapter/mkdir) |创建一个目录。 |
|  [`进程（标准化路径，fn，选项）`]（DataAdapter /进程）|以原子方式读取、修改和保存纯文本文件的内容。 |
|  [`读取（规范化路径）`]（数据适配器/读取）|  |
|  [`readBinary(标准化路径)`](DataAdapter/readBinary) |  |
|  [`删除（规范化路径）`]（数据适配器/删除）|删除一个文件。 |
|  [`重命名（标准化路径，标准化新路径）`]（DataAdapter /重命名）|重命名文件或文件夹。 |
|  [`rmdir(标准化路径，递归)`](DataAdapter/rmdir) |删除一个目录。 |
|  [`stat(标准化路径)`](DataAdapter/stat) |检索有关给定文件/文件夹的元数据。 |
|  [`trashLocal(标准化路径)`](DataAdapter/trashLocal) |移至当地垃圾箱。文件将移至保管库根目录的 <code>.trash</code> 文件夹中。 |
|  [`trashSystem(标准化路径)`](DataAdapter/trashSystem) |尝试移至系统垃圾箱。 |
|  [`写入（规范化路径，数据，选项）`]（DataAdapter /写入）|写入纯文本文件。如果文件存在，其内容将被覆盖，否则将创建文件。 |
|  [`writeBinary（规范化路径，数据，选项）`]（DataAdapter / writeBinary）|写入二进制文件。如果文件存在，其内容将被覆盖，否则将创建文件。 |

