---
aliases: "FileManager.getAvailablePathForAttachment"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`getAvailablePathForAttachment`](文件管理器/getAvailablePathForAttachment)

## FileManager.getAvailablePathForAttachment() 方法

解析保存附件文件的唯一路径。确保父目录存在，如果目标文件名已存在，则对文件名进行重复数据删除。

**签名：**

```typescript
getAvailablePathForAttachment(filename: string, sourcePath?: string): Promise<string>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件名</code> | <code>字符串</code> |正在保存的附件名称 |
|  <code>源路径</code> | <code>字符串</code> | _（可选）_ 与此附件关联的注释的路径，默认为工作区的活动文件。 |

**退货：**

`承诺<字符串>`

根据用户的设置保存附件的完整路径

 1.5.7

