---
aliases: "DataAdapter.appendBinary"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`appendBinary`](DataAdapter/appendBinary)

## DataAdapter.appendBinary() 方法

将数据添加到二进制文件的末尾。

**签名：**

```typescript
appendBinary(normalizedPath: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>数据</code> | | ArrayBuffer | ArrayBuffer要附加的数据。 |
|  <code>选项</code> | [`DataWriteOptions`](DataWriteOptions) | <p>_（可选）_（可选）</p><p> 1.12.3</p> |

**退货：**

`承诺<无效>`

