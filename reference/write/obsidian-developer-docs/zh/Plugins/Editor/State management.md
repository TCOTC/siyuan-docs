本页旨在介绍 [[Editor extensions|editor extensions]] 的状态管理。

> [!note]
> 本页面旨在为 Obsidian 插件开发人员提炼官方 CodeMirror 6 文档。有关状态管理的更多详细信息，请参阅[状态和更新](https://codemirror.net/docs/guide/#state-and-updates)。

## 状态变化

在大多数应用程序中，您可以通过为属性或变量分配新值来更新状态。结果，旧的价值就永远消失了。

```ts
let note = '';
note = 'Heading'
note = '# Heading'
note = '## Heading' // How to undo this?
```

为了支持撤消和重做对用户工作区的更改等功能，Obsidian 等应用程序会保留已进行的所有更改的历史记录。要撤消更改，您可以返回到进行更改之前的时间点。

|   |状态|
|---|------------|
| 0 |            |
| 1 |标题 |
| 2 | # 标题 |
| 3 | ## 标题 |

在 TypeScript 中，你最终会得到这样的结果：

```ts
const changes: ChangeSpec[] = [];

changes.push({ from: 0, insert: 'Heading' });
changes.push({ from: 0, insert: '# ' });
changes.push({ from: 0, insert: '#' });
```

## 交易

想象一个功能，您选择一些文本并按双引号“”以在两侧用引号包围所选内容。实现该功能的一种方法是：

1. 在所选内容的开头插入 `"`。
2. 在所选内容的末尾插入 `"`。

请注意，该实现由两个状态更改组成。如果您将这些添加到撤消历史记录中，用户将需要撤消_两次_，每个双引号一次。为了避免这种情况，如果您可以将这些更改分组，使它们作为一个整体出现，会怎么样？

对于编辑器扩展，一组一起发生的状态更改称为_事务_。

如果您结合到目前为止所学到的知识 - 并且如果您允许仅包含单个状态更改的事务 - 那么您可以将状态视为_事务历史_。

将它们整合在一起以在编辑器扩展中实现之前的环绕功能，以下是向编辑器视图添加或_dispatch_事务的方法：

```ts
view.dispatch({
  changes: [
    { from: selectionStart, insert: `"` },
    { from: selectionEnd, insert: `"` }
  ]
});
```

## 后续步骤

在此页面上，您了解了如何将状态建模为一系列状态更改，以及如何将它们分组为事务。

要了解如何在编辑器中管理自定义状态，请参阅[[State fields]]。
