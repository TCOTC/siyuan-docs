---
aliases: "DataAdapter.append"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`append`](DataAdapter/append)

## DataAdapter.append() 方法

将文本添加到纯文本文件的末尾。

**签名：**

```typescript
append(normalizedPath: string, data: string, options?: DataWriteOptions): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>数据</code> | <code>字符串</code> |要附加的文本。 |
|  <code>选项</code> | [`DataWriteOptions`](DataWriteOptions) | _（可选）_（可选）|

**退货：**

`承诺<无效>`

