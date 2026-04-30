---
aliases: "Plugin.addRibbonIcon"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`插件`](插件) › [`addRibbonIcon`](插件/addRibbonIcon)

## Plugin.addRibbonIcon() 方法

将功能区图标添加到左侧栏。

**签名：**

```typescript
addRibbonIcon(icon: IconName, title: string, callback: (evt: MouseEvent) => any): HTMLElement;
```## 参数

|  参数|类型 |描述 |
|  --- | --- | --- |
|  <code>图标</code> | [`图标名称`](图标名称) |要使用的图标名称。请参阅 [addIcon()](addIcon) |
|  <code>标题</code> | <code>字符串</code> |要在工具提示中显示的标题。 |
|  <code>回调</code> | <code>(evt: </code><code>MouseEvent</code><code>) =>;任何</code> | <p><code>点击</code>回调。</p><p> 0.9.7</p> |

**退货：**

`HTML元素`

