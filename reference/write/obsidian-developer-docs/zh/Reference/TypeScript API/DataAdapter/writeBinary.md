---
aliases: "DataAdapter.writeBinary"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`writeBinary`](DataAdapter/writeBinary)

## DataAdapter.writeBinary() 方法

写入二进制文件。如果文件存在，其内容将被覆盖，否则将创建文件。

**签名：**

```typescript
writeBinary(normalizedPath: string, data: ArrayBuffer, options?: DataWriteOptions): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>数据</code> | | ArrayBuffer | ArrayBuffer新文件内容|
|  <code>选项</code> | [`DataWriteOptions`](DataWriteOptions) | _（可选）_（可选）|

**退货：**

`承诺<无效>`

