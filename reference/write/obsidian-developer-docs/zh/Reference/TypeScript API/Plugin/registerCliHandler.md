---
aliases: "Plugin.registerCliHandler"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`插件`](插件) › [`registerCliHandler`](插件/registerCliHandler)

## Plugin.registerCliHandler() 方法

注册 CLI 处理程序来处理来自 CLI 的命令。命令 ID 必须是全局唯一的。尝试注册已注册的命令将引发错误。

对默认命令使用格式“<plugin-id>”，对子命令和操作使用“<plugin-id>:<action>”格式。

**签名：**

```typescript
registerCliHandler(command: string, description: string, flags: CliFlags | null, handler: CliHandler): void;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>命令</code> | <code>字符串</code> |将使用的命令 ID。使用不含空格的字母数字字符。 |
|  <code>描述</code> | <code>字符串</code> |在帮助命令和自动完成提示中提供的描述文本。 |
|  <code>标志</code> | [`CliFlags`](CliFlags)<code> &#124;空</code> |可以传入的命令行标志。
|  <code>处理程序</code> | [`CliHandler`](CliHandler) | <p>处理 CLI 调用的回调处理程序。</p><p> 1.12.2</p> |

**退货：**

`无效`

