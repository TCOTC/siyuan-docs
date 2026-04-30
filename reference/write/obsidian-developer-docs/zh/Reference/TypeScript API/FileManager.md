---
aliases: "FileManager"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器)

## 文件管理器类

从 UI 管理文件的创建、删除和重命名。

 0.9.7

**签名：**

```typescript
export class FileManager 
```

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`generateMarkdownLink(文件、源路径、子路径、别名)`](FileManager/generateMarkdownLink) |  |根据用户的偏好生成 Markdown 链接。 |
|  [`getAvailablePathForAttachment（文件名，源路径）`](FileManager/getAvailablePathForAttachment) |  |解析保存附件文件的唯一路径。确保父目录存在，如果目标文件名已存在，则对文件名进行重复数据删除。 |
|  [`getNewFileParent(sourcePath, newFilePath)`](FileManager/getNewFileParent) |  |根据用户的首选项，获取新文件应保存到的文件夹。 |
|  [`processFrontMatter(文件，fn，选项)`](FileManager/processFrontMatter) |  | <p>自动读取、修改和保存注释的 frontmatter。 frontmatter 作为 JS 对象传入，应该直接进行变异以获得所需的结果。</p><p>记住要处理此方法抛出的错误。</p> |
|  [`promptForDeletion(文件)`](FileManager/promptForDeletion) |  |提示用户确认要删除指定文件或文件夹|
|  [`renameFile(文件，newPath)`](FileManager/renameFile) |  |安全地重命名或移动文件，并根据用户的首选项更新指向该文件的所有链接。 |
|  [`垃圾文件（文件）`]（文件管理器/垃圾文件）|  |根据用户首选的“垃圾箱”选项从保管库中删除文件或文件夹（将文件移动到 .trash/ 或操作系统垃圾箱）。 |

