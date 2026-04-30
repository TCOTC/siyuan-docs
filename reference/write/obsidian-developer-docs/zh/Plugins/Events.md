Obsidian 中的许多接口允许您订阅整个应用程序中的事件，例如当用户对文件进行更改时。

每当插件卸载时，任何已注册的事件处理程序都需要分离。确保发生这种情况的最安全方法是使用 [[registerEvent|registerEvent()]] 方法。

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerEvent(this.app.vault.on('create', () => {
      console.log('a new file has entered the arena')
    }));
  }
}
```

## 计时事件

如果您想以固定延迟重复调用某个函数，请使用 [`window.setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) 函数和 [[registerInterval|registerInterval()]] 方法。

以下示例在状态栏中显示当前时间，每秒更新一次：

```ts
import { moment, Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  statusBar: HTMLElement;

  async onload() {
    this.statusBar = this.addStatusBarItem();

    this.updateStatusBar();

    this.registerInterval(
      window.setInterval(() => this.updateStatusBar(), 1000)
    );
  }

  updateStatusBar() {
    this.statusBar.setText(moment().format('H:mm:ss'));
  }
}
```

> [!tip] 日期和时间
> [Moment](https://momentjs.com/) 是一个流行的 JavaScript 库，用于处理日期和时间。 Obsidian 在内部使用 Moment，因此您无需自行安装。您可以从 Obsidian API 导入它：
>
>```ts
> import { moment } from 'obsidian';
> ```
