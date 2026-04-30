---
aliases: "Scope.register"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`范围`]（范围） › [`寄存器`]（范围/寄存器）

## Scope.register() 方法

将键盘映射事件处理程序添加到此范围。

**签名：**

```typescript
register(modifiers: Modifier[] | null, key: string | null, func: KeymapEventListener): KeymapEventHandler;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>修饰符</code> | [`修饰符`](修饰符)<代码>[] &#124;空</code> | <code>Mod</code>、<code>Ctrl</code>、<code>Meta</code>、<code>Shift</code> 或 <code>Alt</code>。 <code>Mod</code> 在 macOS 上转换为 <code>Meta</code>，否则转换为 <code>Ctrl</code>。传递 <code>null</code> 以捕获与 <code>key</code> 匹配的所有事件，无论修饰符如何。 |
|  <code>键</code> | <code>字符串 &#124;空</code> |来自 https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key%5FValues 的键码 |
|  <code>函数</code> | [`KeymapEventListener`](KeymapEventListener) |当用户触发按键绑定时将调用的回调。 |

**退货：**

[`KeymapEventHandler`](KeymapEventHandler)

