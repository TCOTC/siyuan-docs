---
aliases: "Keymap"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`键盘映射`]（键盘映射）

## 键映射类

管理不同 [Scope](Scope)<!-- --> 的键盘映射生命周期。

 0.13.9

**签名：**

```typescript
export class Keymap 
```

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`isModEvent(evt)`](键盘映射/isModEvent) | <code>静态</code> | <p>将事件转换为应打开的窗格类型。如果按下修饰键 Cmd/Ctrl 或者这是中键单击 MouseEvent，则返回“tab”。如果按下 Cmd/Ctrl+Alt，则返回“split”。如果按下 Cmd/Ctrl+Alt+Shift，则返回“窗口”。</p><p> 0.16.0</p> |
|  [`isModifier(evt, 修饰符)`](键盘映射/isModifier) | <code>静态</code> | <p>检查在此事件期间是否按下了修饰键。</p><p> 0.12.17</p> |
|  [`popScope(scope)`](键盘映射/popScope) |  | <p>从作用域堆栈中删除作用域。如果给定范围处于活动状态，则堆栈中的下一个范围将处于活动状态。</p><p> 0.13.9</p> |
|  [`pushScope(scope)`](键盘映射/pushScope) |  | <p>将作用域推入作用域堆栈，将其设置为活动作用域来处理所有关键事件。</p><p> 0.13.9</p> |

