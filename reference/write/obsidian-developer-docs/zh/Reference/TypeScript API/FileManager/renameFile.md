---
aliases: "FileManager.renameFile"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`renameFile`](文件管理器/renameFile)

## FileManager.renameFile() 方法

安全地重命名或移动文件，并根据用户的首选项更新指向该文件的所有链接。

**签名：**

```typescript
renameFile(file: TAbstractFile, newPath: string): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件</code> | [`TAbstractFile`]（TAbstractFile）|要重命名的文件 |
|  <code>newPath</code> | <code>字符串</code> | <p>文件的新路径</p><p> 0.11.0</p> |

**退货：**

`承诺<无效>`

