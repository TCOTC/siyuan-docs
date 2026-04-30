---
aliases: "FileManager.getNewFileParent"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`getNewFileParent`](文件管理器/getNewFileParent)

## FileManager.getNewFileParent() 方法

根据用户的首选项，获取新文件应保存到的文件夹。

**签名：**

```typescript
getNewFileParent(sourcePath: string, newFilePath?: string): TFolder;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>源路径</code> | <code>字符串</code> |当前打开/聚焦文件的路径，当用户希望在“同一文件夹中”创建新文件时使用。如果没有活动文件，则使用空字符串。 |
|  <code>newFilePath</code> | <code>字符串</code> | <p>_（可选）_ 将新创建的文件的路径，用于根据路径的扩展名推断要使用的设置。</p><p> 1.1.13</p> |

**退货：**

[`TFolder`](TFolder)

