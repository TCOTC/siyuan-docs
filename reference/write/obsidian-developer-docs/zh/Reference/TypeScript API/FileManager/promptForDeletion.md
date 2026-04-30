---
aliases: "FileManager.promptForDeletion"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`提示删除`](文件管理器/提示删除)

## FileManager.promptForDeletion() 方法

提示用户确认要删除指定的文件或文件夹

**签名：**

```typescript
promptForDeletion(file: TAbstractFile): Promise<boolean>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件</code> | [`TAbstractFile`]（TAbstractFile）|要删除的文件或文件夹|

**退货：**

`承诺<布尔值>`

如果提示被确认则解析为 true，如果提示被取消则解析为 false

 0.15.0

