---
aliases: "MetadataCache.fileToLinktext"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`MetadataCache`](MetadataCache) › [`fileToLinktext`](MetadataCache/fileToLinktext)

## MetadataCache.fileToLinktext() 方法

生成文件的链接文本。

如果文件名是唯一的，则使用文件名。如果不唯一，则使用完整路径。

**签名：**

```typescript
fileToLinktext(file: TFile, sourcePath: string, omitMdExtension?: boolean): string;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件</code> | [`TFile`](TFile) |  |
|  <code>源路径</code> | <code>字符串</code> |  |
|  <code>omitMdExtension</code> | <code>布尔值</code> | _（可选）_ |

**退货：**

`字符串`

