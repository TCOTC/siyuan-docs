---
aliases: "Keymap.isModEvent"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`Keymap`](Keymap) › [`isModEvent`](Keymap/isModEvent)

## Keymap.isModEvent() 方法

将事件转换为应打开的窗格类型。如果按下修饰键 Cmd/Ctrl 或者这是中键单击 MouseEvent，则返回“tab”。如果按下 Cmd/Ctrl+Alt，则返回“split”。如果按下 Cmd/Ctrl+Alt+Shift，则返回“窗口”。

 0.16.0

**签名：**

```typescript
static isModEvent(evt?: UserEvent | null): PaneType | boolean;
```

## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>evt</code> | [`UserEvent`](UserEvent)<code> &#124;空</code> | _（可选）_ |

**退货：**

[`PaneType`](PaneType)` |布尔值`

