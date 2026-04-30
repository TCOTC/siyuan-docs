---
aliases: "App"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`应用程序`]（应用程序）

## 应用程序类

 0.9.7

**签名：**

```typescript
export class App 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`文件管理器`](应用程序/文件管理器) |  | [`文件管理器`](文件管理器) |  0.11.0 |
|  [`键盘映射`]（应用程序/键盘映射）|  | [`键盘映射`]（键盘映射）|  0.9.7 |
|  [`lastEvent`](应用程序/lastEvent) |  | [`UserEvent`](UserEvent)<code> &#124;空</code> | <p>最后一个已知的用户交互事件，帮助命令找出按下了哪些修饰键。</p><p> 0.12.17</p> |
|  [`metadataCache`](应用程序/metadataCache) |  | [`元数据缓存`](元数据缓存) |  0.9.7 |
|  [`renderContext`](应用程序/renderContext) |  | [`渲染上下文`]（渲染上下文）|  1.10.0 |
|  [`范围`]（应用程序/范围）|  | [`范围`]（范围）|  0.9.7 |
|  [`secretStorage`]（应用程序/secretStorage）|  | [`秘密存储`]（秘密存储）|  1.11.4 | 1.11.4
|  [`保险库`]（应用程序/保险库）|  | [`保险库`]（保险库）|  0.9.7 |
|  [`工作区`]（应用程序/工作区）|  | [`工作区`]（工作区）|  0.9.7 |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`isDarkMode()`](应用程序/isDarkMode) |  |  1.10.0 |
|  [`loadLocalStorage(key)`](应用程序/loadLocalStorage) |  |从此保管库的 <code>localStorage</code> 中检索值。 |
|  [`saveLocalStorage(key, data)`](应用程序/saveLocalStorage) |  |将保管库特定的值保存到 <code>localStorage</code>。如果数据为<code>null</code>，则该条目将被清除。 |

