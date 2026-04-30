---
aliases: "BasesViewRegistration"
cssclasses: hide-title
---

<!-- 不要编辑此文件。它由 API Documenter 自动生成。 -->

[`BasesViewRegistration`](BasesViewRegistration)

## BasesView注册接口

注册新的 Bases 视图类型时的选项容器。

 1.10.0

**签名：**

```typescript
export interface BasesViewRegistration 
```

## 属性

|  物业 |修改器 |类型 |描述 |
|  --- | --- | --- | --- |
|  [`工厂`](BasesViewRegistration/工厂) |  | [`BasesViewFactory`](BasesViewFactory) |  1.10.0 |
|  [`图标`](BasesViewRegistration/图标) |  | [`图标名称`](图标名称) | <p>要在基础视图选择器中使用的图标 ID。请参阅 [https://docs.obsidian.md/Plugins/User+interface/Icons](https://docs.obsidian.md/Plugins/User+interface/Icons) 了解可用图标以及如何添加自己的图标。</p><p> 1.10.0</p> |
|  [`名称`](BasesViewRegistration/名称) |  | <code>字符串</code> |  1.10.0 |
|  [`选项？`](BasesViewRegistration/选项) |  | <code>(config: </code>[`BasesViewConfig`](BasesViewConfig)<code>) =>; </code>[`BasesAllOptions`](BasesAllOptions)<code>[]</code> | _（可选）_ 1.10.0 |

