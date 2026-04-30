---
aliases: "PluginSettingTab"
cssclasses: hide-title
---
<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`PluginSettingTab`](PluginSettingTab)

## PluginSettingTab 类

为用户配置插件提供统一的界面。

**签名：**

```typescript
export abstract class PluginSettingTab extends SettingTab 
```**扩展：** [`SettingTab`](SettingTab)

## 构造函数

|  构造函数|修改器 |描述 |
|  --- | --- | --- |
|  [`(构造函数)(应用程序，插件)`](PluginSettingTab/(构造函数).md) |  |构造 <code>PluginSettingTab</code> 类的新实例 |

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`应用程序`]（设置选项卡/应用程序）|  | [`应用程序`]（应用程序）| <p>对应用实例的引用。</p><p>（继承自 [SettingTab](SettingTab)<!-- -->)</p> |
|  [`containerEl`](SettingTab/containerEl) |  | <code>HTMLElement</code> | <p>设置选项卡内容的 HTML 元素。</p><p>（继承自 [SettingTab](SettingTab)<!-- -->)</p> |
|  [`图标`]（设置选项卡/图标）|  | [`图标名称`](图标名称) | <p>要在设置侧边栏中显示的图标。</p><p> 1.11.0</p><p>（继承自 [SettingTab](SettingTab)<!-- -->)</p> |

## 方法

|  方法|修改器 |描述 |
|  --- | --- | --- |
|  [`显示（）`]（设置选项卡/显示）| <code>摘要</code> | <p>应呈现设置选项卡时调用。</p><p>（继承自 [SettingTab](SettingTab)<!-- -->)</p> |
|  [`隐藏()`](设置选项卡/隐藏) |  | <p>隐藏设置选项卡的内容。当视图隐藏时，所有注册的组件都应该被卸载。如果您需要执行额外的清理，请覆盖此设置。</p><p>（继承自 [SettingTab](SettingTab)<!-- -->)</p> |

