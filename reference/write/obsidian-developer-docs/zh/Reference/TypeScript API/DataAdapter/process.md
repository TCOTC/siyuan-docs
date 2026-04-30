---
aliases: "DataAdapter.process"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`process`](DataAdapter/process)

## DataAdapter.process() 方法

以原子方式读取、修改和保存纯文本文件的内容。

**签名：**

```typescript
process(normalizedPath: string, fn: (data: string) => string, options?: DataWriteOptions): Promise<string>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件/文件夹的路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>fn</code> | <代码>（数据：字符串）=>字符串</code> |同步返回文件新内容的回调函数。 |
|  <code>选项</code> | [`DataWriteOptions`](DataWriteOptions) | _（可选）_ 写入选项。 |

**退货：**

`承诺<字符串>`

string - 写入的文件的文本值。

