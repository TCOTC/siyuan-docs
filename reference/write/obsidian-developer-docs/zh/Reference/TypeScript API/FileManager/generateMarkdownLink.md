---
aliases: "FileManager.generateMarkdownLink"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`generateMarkdownLink`](文件管理器/generateMarkdownLink)

## FileManager.generateMarkdownLink() 方法

根据用户的偏好生成 Markdown 链接。

**签名：**

```typescript
generateMarkdownLink(file: TFile, sourcePath: string, subpath?: string, alias?: string): string;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件</code> | [`TFile`](TFile) |要链接到的文件。 |
|  <code>源路径</code> | <code>字符串</code> |链接存储的位置，用于计算相对链接。 |
|  <code>子路径</code> | <code>字符串</code> | _（可选）_ 以<code>#</code> 开头的子路径，用于链接到标题或块。 |
|  <code>别名</code> | <code>字符串</code> | <p>_（可选）_ 显示文本（如果它与文件名不同）。传递空字符串以使用文件名。</p><p> 0.12.0</p> |

**退货：**

`字符串`

