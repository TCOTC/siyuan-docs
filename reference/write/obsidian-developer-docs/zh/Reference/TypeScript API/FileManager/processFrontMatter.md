---
aliases: "FileManager.processFrontMatter"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`文件管理器`](文件管理器) › [`processFrontMatter`](文件管理器/processFrontMatter)

## FileManager.processFrontMatter() 方法

原子地读取、修改和保存注释的前文。 frontmatter 作为 JS 对象传入，应该直接进行变异以达到所需的结果。

请记住处理此方法引发的错误。

**签名：**

```typescript
processFrontMatter(file: TFile, fn: (frontmatter: any) => void, options?: DataWriteOptions): Promise<void>;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>文件</code> | [`TFile`](TFile) |要修改的文件。必须是 Markdown 文件。 |
|  <code>fn</code> | <code>(frontmatter: 任意) =>无效</code> |同步改变 frontmatter 对象的回调函数。 |
|  <code>选项</code> | [`DataWriteOptions`](DataWriteOptions) | _（可选）_ 写入选项。 |

**退货：**

`承诺<无效>`

## 例外情况

如果 YAML 解析失败，则出现 YAMLParseError

您的回调函数抛出的任何错误

## 示例


```ts
app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter['key1'] = value;
    delete frontmatter['key2'];
});
```
 1.4.4

