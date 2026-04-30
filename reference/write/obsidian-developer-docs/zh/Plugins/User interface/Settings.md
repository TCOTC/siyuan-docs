如果您希望用户能够自己配置插件的某些部分，您可以将它们公开为_settings_。

在本指南中，您将了解如何创建这样的设置页面👇

![[settings.png]]

向插件添加设置的主要原因是存储即使在用户退出 Obsidian 后仍然保留的配置。以下示例演示如何从磁盘保存和加载设置：

```ts
import { Plugin } from 'obsidian';
import { ExampleSettingTab } from './settings';

interface ExamplePluginSettings {
  sampleValue: string;
}

const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  sampleValue: 'Lorem ipsum',
};

export default class ExamplePlugin extends Plugin {
  settings: ExamplePluginSettings;

  async onload() {
    await this.loadSettings();

    this.addSettingTab(new ExampleSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

> [!warning] 设置中的嵌套属性
> `Object.assign()` 复制对任何嵌套属性的引用（浅复制）。如果您的设置对象包含嵌套属性，则需要递归复制每个嵌套属性（深层复制）。否则，对嵌套属性的任何更改都将应用于使用“Object.assign()”复制的所有对象。

这里发生了很多事情🤯，所以让我们仔细看看每个部分。

## 创建设置定义

首先，您需要定义希望用户能够配置哪些设置。因此，您创建一个接口“ExamplePluginSettings”。启用插件后，您可以从“settings”成员变量访问其设置，在我们的示例中，该变量的类型为“ExamplePluginSettings”。

```ts
interface ExamplePluginSettings {
  sampleValue: string;
}

export default class ExamplePlugin extends Plugin {
  settings: ExamplePluginSettings;

  // ...
}
```

## 保存并加载设置对象

[[loadData|loadData()]] 和 [[saveData|saveData()]] 提供了一种从磁盘存储和检索数据的简单方法。该示例还引入了两个辅助方法，可以更轻松地使用插件其他部分的“loadData()”和“saveData()”。

```ts
export default class ExamplePlugin extends Plugin {

  // ...

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
```

最后，确保在插件加载时加载设置：

```ts
async onload() {
  await this.loadSettings();

  // ...
}
```

## 提供默认值

当用户第一次启用该插件时，尚未配置任何设置。前面的示例为任何缺少的设置提供了默认值。

要了解其工作原理，请查看以下代码：

```ts
Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
```

`Object.assign()` 是一个 JavaScript 函数，它将所有属性从一个对象复制到另一个对象。 `loadData()` 返回的任何属性都会覆盖 `DEFAULT_SETTINGS` 中的属性。

```ts
const DEFAULT_SETTINGS: Partial<ExamplePluginSettings> = {
  sampleValue: 'Lorem ipsum',
};
```

> [!tip]
> `Partial<Type>` 是一个 TypeScript 实用程序，它返回一个类型，并将 `Type` 的所有属性设置为可选。它启用类型检查，同时允许您仅定义要为其提供默认值的属性。

## 注册一个设置选项卡

该插件现在可以保存和加载插件配置，但用户还没有任何方法可以更改任何设置。通过添加设置选项卡，您可以为用户提供易于使用的界面来更新其插件设置：

```ts
this.addSettingTab(new ExampleSettingTab(this.app, this));
```

这里，“ExampleSettingTab”是一个扩展[[PluginSettingTab|PluginSettingTab]]的类：

```ts
import ExamplePlugin from './main';
import { App, PluginSettingTab, Setting } from 'obsidian';

export class ExampleSettingTab extends PluginSettingTab {
  plugin: ExamplePlugin;

  constructor(app: App, plugin: ExamplePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('Default value')
      .addText((text) =>
        text
          .setPlaceholder('Lorem ipsum')
          .setValue(this.plugin.settings.sampleValue)
          .onChange(async (value) => {
            this.plugin.settings.sampleValue = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
```

`display()` 是您构建设置选项卡内容的地方。如需了解更多信息，请参阅[[HTML elements]]。

`new Setting(containerEl)` 将设置附加到容器元素。此示例仅使用“addText()”提供了一个文本字段，但还有其他几种可用的设置类型。
[[Setting]] 类还提供了一些函数，例如 `setName` 和 `setDesc` 来为您的设置提供名称和描述。

每当文本字段的值发生更改时更新设置对象，然后将其保存到磁盘：

```ts
.onChange(async (value) => {
  this.plugin.settings.sampleValue = value;
  await this.plugin.saveSettings();
})
```

干得好！ 💪 您的用户会感谢您为他们提供了一种自定义与您的插件交互方式的方法。在阅读下一个指南之前，请通过添加其他设置来试验您所学到的内容。

## 可用的设置类型

### 标题

如果您的插件中有很多设置，将设置分成不同的部分可能会很有用。
```ts
new Setting(containerEl).setName("Defaults").setHeading();
```
由于“设置”选项卡下的所有内容都是设置，因此为每个标题重复“设置”一词或同义词就变得多余了。
常规设置应位于设置选项卡的顶部，并且不应有标题。
＃＃＃ 文本

```ts
new Setting(containerEl)  
    .setName('Text input')  
    .setDesc('Sample description')  
    .addText((text) =>  
       text  
          .setPlaceholder('Lorem ipsum')  
          .setValue(this.plugin.settings.sampleValue)  
          .onChange(async (value) => {  
            ...
          })
    );
```

### 文本区域

```ts
new Setting(containerEl)  
    .setName('Textarea') 
    .addTextArea((text) => {  
	    ...
    });
```

### 搜索

要向用户提供可搜索的可用项目列表，您可以实现 [[AbstractInputSuggest]] 类并将其连接到搜索。 （但它也适用于常规文本输入）

![[settings-suggestions.png]]

```ts
new Setting(containerEl)  
    .setName('Search')  
    .addSearch(search => {  
       search.setValue(this.plugin.settings.icon)  
          .setPlaceholder('Search for an icon')  
          .onChange(async (value) => {  
             this.plugin.settings.icon = value;  
             await this.plugin.saveSettings();  
          });  
       new IconSuggest(this.plugin.app, search.inputEl);  
    });
```


### 时刻格式

Obsidian 使用 [moment.js](https://momentjs.com/) 库来格式化日期。
该库支持自定义标记来自定义结果字符串的外观。
[[MomentFormatComponent]] 可用于呈现当前配置格式的示例。

```ts
const dateDesc = document.createDocumentFragment();  
dateDesc.appendText('For a list of all available tokens, see the ');  
dateDesc.createEl('a', {  
    text: 'format reference',  
    attr: { href: 'https://momentjs.com/docs/#/displaying/format/', target: '_blank' }  
});  
dateDesc.createEl('br');  
dateDesc.appendText('Your current syntax looks like this: ');  
const dateSampleEl = dateDesc.createEl('b', 'u-pop');  
new Setting(containerEl)  
    .setName('Date format')  
    .setDesc(dateDesc)  
    .addMomentFormat(momentFormat => momentFormat  
       .setValue(this.plugin.settings.dateFormat)  
       .setSampleEl(dateSampleEl)  
       .setDefaultFormat('MMMM dd, yyyy')  
       .onChange(async (value) => {  
          this.plugin.settings.dateFormat = value;  
          await this.plugin.saveSettings();  
       }));
```

### 按钮
```ts
new Setting(containerEl)  
    .setName('Button')  
    .setDesc('With extra button')  
    .addButton(button => button  
       .setButtonText('Click me!')  
       .onClick(() => {  
          new Notice('This is a notice!');  
       })  
    )
);
```

您还可以将多个按钮添加到同一设置以执行不同的操作。

### 额外按钮

例如，可以将此按钮添加到任何其他设置类型，以将其重置为默认值。

```ts
new Setting(containerEl)  
    .setName('Button')  
    .setDesc('With extra button')  
    .addButton(button => button  
       .setButtonText('Click me!')  
       .onClick(() => {  
         /...
       })  
    ).addExtraButton(button => button  
    .setIcon('gear')  
    .onClick(() => {  
       //...  
    })  
);
```

### 切换
```ts
new Setting(containerEl)  
    .setName('Toggle')  
    .addToggle(toggle => toggle  
       .setValue(this.plugin.settings.localServer)  
       .onChange(async (value) => {  
          this.plugin.settings.localServer = value;  
          await this.plugin.saveSettings();  
          this.display();  
       })  
    );
```

### 下拉菜单
```ts
new Setting(containerEl)  
    .setName('Dropdown')  
    .addDropdown((dropdown) =>  
       dropdown  
          .addOption('1', 'Option 1')  
          .addOption('2', 'Option 2')  
          .addOption('3', 'Option 3')  
          .setValue(this.plugin.settings.mySetting)  
          .onChange(async (value) => {  
             this.plugin.settings.mySetting = value;  
             await this.plugin.saveSettings();  
          })  
    );
```

＃＃＃ 滑块

```ts
new Setting(containerEl)  
    .setName('Slider')  
    .setDesc('with tooltip')  
    .addSlider(slider => slider.setDynamicTooltip()  
    );
```

### 进度条

虽然滑块允许数字输入，但进度条可以显示在后台运行的任务的进度，但它也可以用于显示配额，例如使用的磁盘空间。

```ts
new Setting(containerEl)  
    .setName('Progress bar')  
    .setDesc('It\'s 50% done')  
    .addProgressBar(bar => bar.setValue(50));
```

### 颜色选择器

```ts
new Setting(containerEl)
    .setName('Color picker')
    .addColorPicker(color => color
       .setValue('#FFFFFF')
    );
```
