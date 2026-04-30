装饰可让您控制如何在 [[Editor extensions|editor extensions]] 中绘制内容或设置内容样式。如果您打算通过在编辑器中添加、替换元素或设置元素样式来更改外观，则很可能需要使用装饰。

读完本页后，您将能够：

- 了解如何使用装饰来更改编辑器外观。
- 了解使用状态字段和视图插件提供装饰之间的区别。

> [!note]
> 本页面旨在为 Obsidian 插件开发人员提炼官方 CodeMirror 6 文档。有关状态字段的更多详细信息，请参阅[装饰文档](https://codemirror.net/docs/guide/#decorating-the-document)。

## 先决条件

- 对[[State fields]]的基本了解。
- 对[[View plugins]]的基本了解。

## 概述

如果没有修饰，文档将呈现为纯文本。一点也不有趣。使用装饰，您可以更改文档的显示方式，例如突出显示文本或添加自定义 HTML 元素。

您可以使用以下类型的装饰：

- [标记装饰](https://codemirror.net/docs/ref/#view.Decoration%5Emark) 样式现有元素。
- [小部件装饰](https://codemirror.net/docs/ref/#view.Decoration%5Ewidget) 在文档中插入元素。
- [替换装饰](https://codemirror.net/docs/ref/#view.Decoration%5Ereplace) 隐藏文档的一部分或将其替换为其他元素。
- [线条装饰](https://codemirror.net/docs/ref/#view.Decoration%5Eline) 向线条而不是文档本身添加样式。

要使用装饰，您需要在编辑器扩展内创建它们，并让扩展将它们提供给编辑器。您可以通过两种方式向编辑器提供修饰，即_直接_使用[[State fields|state fields]]或_间接_使用[[View plugins|view plugins]]。

## 我应该使用视图插件还是状态字段？

视图插件和状态字段都可以为编辑器提供装饰，但它们有一些区别。

- 如果您可以根据 [[Viewport]] 内部的内容确定装饰，请使用视图插件。
- 如果您需要管理视口之外的装饰，请使用状态字段。
- 如果您想要进行可能更改视口内容的更改（例如通过添加换行符），请使用状态字段。

如果您可以使用任一方法实现扩展，那么视图插件通常会带来更好的性能。例如，假设您想要实现一个编辑器扩展来检查文档的拼写。

一种方法是将整个文档传递给外部拼写检查器，然后该检查器返回拼写错误列表。在这种情况下，您需要将每个错误映射到装饰，并使用状态字段来管理装饰，无论当前视口中有什么。

另一种方法是仅对视口中可见的内容进行拼写检查。当用户滚动文档时，扩展程序需要连续运行拼写检查，但您可以对包含数百万行文本的文档进行拼写检查。

![状态字段与视图插件](decorations.svg)

## 提供装饰品

想象一下，您想要构建一个编辑器扩展，用表情符号替换项目符号列表项。您可以使用视图插件或状态字段来完成此操作，但有一些区别。  在本节中，您将了解如何使用这两种类型的扩展来实现它。

两种实现共享相同的核心逻辑：

1. 使用[syntaxTree](https://codemirror.net/docs/ref/#language.syntaxTree)查找列表项。
2. 对于每个列表项，将前导连字符“-”替换为 _widget_。

### 小部件

小部件是可以添加到编辑器的自定义 HTML 元素。您可以在文档中的特定位置插入小部件，也可以用小部件替换一段内容。

以下示例定义了一个返回 HTML 元素“<span>👉</span>”的小部件。稍后您将使用此小部件。

```ts
import { EditorView, WidgetType } from '@codemirror/view';

export class EmojiWidget extends WidgetType {
  toDOM(view: EditorView): HTMLElement {
    const div = document.createElement('span');

    div.innerText = '👉';

    return div;
  }
}
```

要将文档中的一系列内容替换为表情符号小部件，请使用[替换装饰](https://codemirror.net/docs/ref/#view.Decoration%5Ereplace)。

```ts
const decoration = Decoration.replace({
  widget: new EmojiWidget()
});
```

### 状态字段

提供来自州场的装饰品：

1. [[State fields#Defining a state field|Define a state field]] 具有 `DecorationSet` 类型。
2. 将 `provide` 属性添加到 state 字段。

   ```ts
   provide(field: StateField<DecorationSet>): Extension {
     return EditorView.decorations.from(field);
   },
   ```

```ts
import { syntaxTree } from '@codemirror/language';
import {
  Extension,
  RangeSetBuilder,
  StateField,
  Transaction,
} from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  WidgetType,
} from '@codemirror/view';
import { EmojiWidget } from 'emoji';

export const emojiListField = StateField.define<DecorationSet>({
  create(state): DecorationSet {
    return Decoration.none;
  },
  update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    syntaxTree(transaction.state).iterate({
      enter(node) {
        if (node.type.name.startsWith('list')) {
          // Position of the '-' or the '*'.
          const listCharFrom = node.from - 2;

          builder.add(
            listCharFrom,
            listCharFrom + 1,
            Decoration.replace({
              widget: new EmojiWidget(),
            })
          );
        }
      },
    });

    return builder.finish();
  },
  provide(field: StateField<DecorationSet>): Extension {
    return EditorView.decorations.from(field);
  },
});
```

### 查看插件

要使用视图插件管理您的装饰：

1. [[View plugins#Creating a view plugin|Create a view plugin]]。
2. 将 `DecorationSet` 成员属性添加到您的插件中。
3. 在`constructor()`中初始化装饰。
4. 在`update()`中重建装饰。

并非所有更新都是重建装饰品的理由。以下示例仅在底层文档或视口发生更改时重建装饰。

```ts
import { syntaxTree } from '@codemirror/language';
import { RangeSetBuilder } from '@codemirror/state';
import {
  Decoration,
  DecorationSet,
  EditorView,
  PluginSpec,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { EmojiWidget } from 'emoji';

class EmojiListPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    for (let { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter(node) {
          if (node.type.name.startsWith('list')) {
            // Position of the '-' or the '*'.
            const listCharFrom = node.from - 2;

            builder.add(
              listCharFrom,
              listCharFrom + 1,
              Decoration.replace({
                widget: new EmojiWidget(),
              })
            );
          }
        },
      });
    }

    return builder.finish();
  }
}

const pluginSpec: PluginSpec<EmojiListPlugin> = {
  decorations: (value: EmojiListPlugin) => value.decorations,
};

export const emojiListPlugin = ViewPlugin.fromClass(
  EmojiListPlugin,
  pluginSpec
);
```

`buildDecorations()` 是一个辅助方法，它基于编辑器视图构建一套完整的装饰。

请注意“ViewPlugin.fromClass()”函数的第二个参数。 “PluginSpec”中的“decorations”属性指定视图插件如何向编辑器提供装饰。

由于视图插件知道用户可以看到什么，因此您可以使用“view.visibleRanges”来限制要访问语法树的哪些部分。
