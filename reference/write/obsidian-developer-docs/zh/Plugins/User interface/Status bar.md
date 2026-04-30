要在状态栏中创建新块，请在`onload()`方法中调用[[addStatusBarItem|addStatusBarItem()]]。 `addStatusBarItem()` 方法返回一个 [[HTML elements|HTML element]]，您可以向其中添加自己的元素。

> [!caution] 黑曜石手机
> Obsidian 移动应用程序上的自定义状态栏项目[**不**支持](https://discord.com/channels/686053708261228577/707816848615407697/832321402106544179)。

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    const item = this.addStatusBarItem();
    item.createEl('span', { text: 'Hello from the status bar 👋' });
  }
}
```

> [!note]
> 有关如何使用`createEl()`方法的更多信息，请参阅[[HTML elements]]。

您可以通过多次调用“addStatusBarItem()”来添加多个状态栏项目。由于 Obsidian 默认情况下会在每个状态栏项目之间添加间隙，因此如果您想更好地控制间距，则必须将多个 HTML 元素分组到一个状态栏项目中。

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    const fruits = this.addStatusBarItem();
    fruits.createEl('span', { text: '🍎' });
    fruits.createEl('span', { text: '🍌' });

    const veggies = this.addStatusBarItem();
    veggies.createEl('span', { text: '🥦' });
    veggies.createEl('span', { text: '🥬' });
  }
}
```

上面的示例会产生以下状态栏：

![[status-bar.png]]
