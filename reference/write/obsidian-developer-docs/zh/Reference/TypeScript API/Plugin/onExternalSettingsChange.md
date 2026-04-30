---
aliases: "Plugin.onExternalSettingsChange"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`插件`](插件) › [`onExternalSettingsChange`](插件/onExternalSettingsChange)

## Plugin.onExternalSettingsChange() 方法

当从 Obsidian 外部修改磁盘上的“data.json”文件时调用。这通常意味着同步服务或外部程序已修改插件设置。

实现此方法以在外部更改时重新加载插件设置。

 1.5.7

**签名：**

```typescript
onExternalSettingsChange?(): any;
```**退货：**

`任何`

