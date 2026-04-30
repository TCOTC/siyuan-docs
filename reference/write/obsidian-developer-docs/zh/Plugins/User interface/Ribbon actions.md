Obsidian 界面左侧的侧边栏主要称为_ribbon_。功能区的目的是托管插件定义的操作。

要向功能区添加操作，请使用 [[addRibbonIcon|addRibbonIcon()]] 方法：

```ts
import { Plugin } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.addRibbonIcon('dice', 'Print to console', () => {
      console.log('Hello, you!');
    });
  }
}
```

第一个参数指定要使用的图标。有关可用图标以及如何添加自己的图标的更多信息，请参阅[[Plugins/User interface/Icons|Icons]]。

> [!note]
> 用户可以从功能区中删除插件的图标，甚至选择完全隐藏功能区。因此，建议包含访问功能区中的功能的替代方法，例如创建 [[Plugins/User interface/Commands|command]]。还建议插件不要为功能区项目添加自己的切换。
