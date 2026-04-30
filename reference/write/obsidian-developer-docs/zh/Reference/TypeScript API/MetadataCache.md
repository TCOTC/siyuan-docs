---
aliases: "MetadataCache"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`元数据缓存`](元数据缓存)

## 元数据缓存类

链接文本是由路径和子路径组成的任何内部链接，例如“我的笔记\#标题” 链接路径（或路径）是链接文本的路径部分 子路径是链接文本的标题/块 ID 部分。

**签名：**

```typescript
export class MetadataCache extends Events 
```**扩展：** [`事件`]（事件）

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`resolvedLinks`](MetadataCache/resolvedLinks) |  | <code>记录</code><code><字符串，</code><code>记录</code><code><字符串，数字>></code> |包含所有已解析的链接。该对象将每个源文件的路径映射到具有链接计数的目标文件路径的对象。源路径和目标路径都是来自 <code>TFile.path</code> 的 Vault 绝对路径，可与 <code>Vault.getAbstractFileByPath(path)</code> 一起使用。 |
|  [`unresolvedLinks`](MetadataCache/unresolvedLinks) |  | <code>记录</code><code><字符串，</code><code>记录</code><code><字符串，数字>></code> |包含所有未解析的链接。该对象将每个源文件映射到具有计数的未知目的地的对象。源路径都是Vault绝对路径，类似于<code>resolvedLinks</code>。 |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`fileToLinktext(文件，sourcePath，omitMdExtension)`](MetadataCache/fileToLinktext) |  | <p>生成文件的链接文本。</p><p>如果文件名是唯一的，则使用文件名。如果不唯一，请使用完整路径。</p> |
|  [`getCache(路径)`](MetadataCache/getCache) |  |  0.14.5 | 0.14.5
|  [`getFileCache(文件)`](MetadataCache/getFileCache) |  |  0.9.21 |
|  [`getFirstLinkpathDest(linkpath, sourcePath)`](MetadataCache/getFirstLinkpathDest) |  | <p>获取链接路径的最佳匹配。</p><p> 0.12.5</p> |
|  [`off(名称，回调)`](事件/关闭) |  | <p> 0.9.7</p><p>（继承自 [Events](Events)<!-- -->)</p> |
|  [`offref(ref)`](活动/offref) |  | <p> 0.9.7</p><p>（继承自 [Events](Events)<!-- -->)</p> |
|  [`on(name: '已更改', 回调, ctx)`](MetadataCache/on('已更改').md) |  | <p>当文件已被索引并且其（更新的）缓存现在可用时调用。</p><p>注意：由于性能原因重命名文件时不会调用此函数。您必须为这些挂钩保管库重命名事件。</p> |
|  [`on(name: '已删除', 回调, ctx)`](MetadataCache/on('已删除').md) |  |当文件被删除时调用。提供了缓存元数据的尽力而为的先前版本，但如果文件先前未成功缓存，则它可能为空。 |
|  [`on(name: 'resolve',callback, ctx)`](MetadataCache/on('resolve').md) |  |当文件已解析为 <code>resolvedLinks</code> 和 <code>unresolvedLinks</code> 时调用。有时在对文件建立索引后会发生这种情况。 |
|  [`on(name: '已解决', 回调, ctx)`](MetadataCache/on('已解决').md) |  |当所有文件都已解析时调用。每次在初始加载后修改文件时都会触发此操作。 |
|  [`触发器（名称，数据）`]（事件/触发器）|  | <p> 0.9.7</p><p>（继承自 [Events](Events)<!-- -->)</p> |
|  [`tryTrigger(evt, args)`](事件/tryTrigger) |  | <p> 0.9.7</p><p>（继承自 [Events](Events)<!-- -->)</p> |

