---
aliases: "DataAdapter.rmdir"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`DataAdapter`](DataAdapter) › [`rmdir`](DataAdapter/rmdir)

## DataAdapter.rmdir() 方法

删除一个目录。

**签名：**

```typescript
rmdir(normalizedPath: string, recursive: boolean): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>标准化路径</code> | <code>字符串</code> |文件夹路径，使用 [normalizePath()](normalizePath) 预先标准化。 |
|  <code>递归</code> | <code>布尔值</code> |如果<code>true</code>，则递归删除该文件夹下的文件夹，如果<code>false</code>则该文件夹需要为空。 |

**退货：**

`承诺<无效>`

