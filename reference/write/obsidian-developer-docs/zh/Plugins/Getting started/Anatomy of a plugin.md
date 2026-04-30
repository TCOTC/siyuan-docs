[[Plugin|Plugin]] 类定义插件的生命周期，并向所有插件暴露可用操作：

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    // Configure resources needed by the plugin.
  }
  async onunload() {
    // Release any resources configured by the plugin.
  }
}
```

## 插件生命周期

[[onload|onload()]] 在用户开始在 Obsidian 中使用该插件时运行。大部分插件能力在此配置。

[[onunload|onunload()]] 在插件被禁用时运行。插件占用的资源必须在此释放，以免在禁用后仍影响 Obsidian 的性能。

若要更好理解这两个方法的调用时机，可在插件加载与卸载时向控制台打印信息。控制台是开发者监控代码状态的重要工具。

查看控制台：

1. 在 Windows 与 Linux 上按 Ctrl+Shift+I，在 macOS 上按 Cmd-Option-I，打开开发者工具。
2. 在开发者工具窗口中点击「Console」标签页。

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    console.log('loading plugin')
  }
  async onunload() {
    console.log('unloading plugin')
  }
}
```
