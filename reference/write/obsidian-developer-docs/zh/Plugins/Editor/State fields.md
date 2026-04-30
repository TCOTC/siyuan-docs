状态字段是一个 [[Editor extensions|editor extension]]，可让您管理自定义编辑器状态。此页面将引导您通过实现计算器扩展来构建状态字段。

计算器应该能够在当前状态中添加和减去一个数字，并在您想要重新开始时重置状态。

读完本页后，您将了解构建状态字段的基本概念。

> [!note]
> 本页面旨在为 Obsidian 插件开发人员提炼官方 CodeMirror 6 文档。有关状态字段的更多详细信息，请参阅[状态字段](https://codemirror.net/docs/guide/#state-fields)。

## 先决条件

- 对[[State management]]的基本了解。

## 定义状态效果

状态效果描述了您想要进行的状态更改。您可以将它们视为类的方法。

在计算器示例中，您将为每个计算器操作定义状态效果：

```ts
const addEffect = StateEffect.define<number>();
const subtractEffect = StateEffect.define<number>();
const resetEffect = StateEffect.define();
```

尖括号“<>”之间的类型定义效果的输入类型。例如，您要加或减的数字。重置效果不需要任何输入，因此您可以将其省略。

## 定义状态字段

与人们的想法相反，状态字段实际上并不存储状态。他们_管理_它。状态字段采用当前状态，应用任何状态效果，并返回新状态。

状态字段包含计算器逻辑，用于根据交易中的效果应用数学运算。由于一笔交易可以包含多种效果，例如两次添加，因此状态字段需要将它们依次应用。

```ts
export const calculatorField = StateField.define<number>({
  create(state: EditorState): number {
    return 0;
  },
  update(oldState: number, transaction: Transaction): number {
    let newState = oldState;

    for (let effect of transaction.effects) {
      if (effect.is(addEffect)) {
        newState += effect.value;
      } else if (effect.is(subtractEffect)) {
        newState -= effect.value;
      } else if (effect.is(resetEffect)) {
        newState = 0;
      }
    }

    return newState;
  },
});
```

- `create` 返回计算器开始的值。
- `update` 包含应用效果的逻辑。
- `effect.is()` 可让您在应用效果之前检查效果的类型。

## 调度状态效果

要将状态效果应用于状态字段，您需要将其作为事务的一部分分派到编辑器视图。

```ts
view.dispatch({
  effects: [addEffect.of(num)],
});
```

您甚至可以定义一组辅助函数来提供更熟悉的 API：

```ts
export function add(view: EditorView, num: number) {
  view.dispatch({
    effects: [addEffect.of(num)],
  });
}

export function subtract(view: EditorView, num: number) {
  view.dispatch({
    effects: [subtractEffect.of(num)],
  });
}

export function reset(view: EditorView) {
  view.dispatch({
    effects: [resetEffect.of(null)],
  });
}
```

## 后续步骤

从您的状态字段中提供 [[Decorations]] 以更改文档的显示方式。
