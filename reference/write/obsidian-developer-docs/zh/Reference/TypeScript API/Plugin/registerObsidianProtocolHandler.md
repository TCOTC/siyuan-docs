---
aliases: "Plugin.registerObsidianProtocolHandler"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Plugin`](插件) › [`registerObsidianProtocolHandler`](插件/registerObsidianProtocolHandler)

## Plugin.registerObsidianProtocolHandler() 方法

注册 obsidian:// URL 的处理程序。

**签名：**

```typescript
registerObsidianProtocolHandler(action: string, handler: ObsidianProtocolHandler): void;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>操作</code> | <code>字符串</code> |动作字符串。例如，“open”对应于 <code>obsidian://open</code>。 |
|  <code>处理程序</code> | [`ObsidianProtocolHandler`](ObsidianProtocolHandler) | <p>要触发的回调。将传入从查询中解码的键值对。例如，<code>obsidian://open?key=value</code> 将生成 <code>{'action': 'open', 'key': 'value'}</code>。</p><p> 0.11.0</p> |

**退货：**

`无效`

