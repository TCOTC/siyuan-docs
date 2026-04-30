---
permalink: plugins/guides/secret-storage
aliases:
  - SecretStorage and SecretComponent
---
[[SecretStorage]] 提供了一种安全的方式来存储和管理 Obsidian 插件中的 API 密钥和令牌等敏感数据。 SecretStorage 不是直接将机密存储在插件的“data.json”文件中，而是提供了一个集中式键值存储，允许用户在多个插件之间共享机密。

在本指南中，您将了解如何使用 [[SecretStorage]] 和 [[SecretComponent]] 安全地处理插件设置中的机密。

## 你将学到什么

完成本指南后，您将能够：

- 用 SecretComponent 替换直接秘密输入。
- 使用 SecretStorage API 检索存储的机密。
- 了解 SecretStorage 为什么可以提高安全性和用户体验。

## 开始之前

本指南假设您熟悉在 Obsidian 中创建插件设置。如果您还没有阅读[[Settings]]，了解如何创建设置选项卡并保存插件配置。

## 为什么使用 SecretStorage？

当插件直接将机密存储在“data.json”中时，会出现几个问题：

- **安全**：秘密以明文形式与其他插件数据一起存储。
- **复制**：用户必须将相同的 API 密钥复制到每个需要它的插件中。
- **维护**：如果令牌发生变化，用户必须手动更新每个插件。

SecretStorage 通过提供秘密的中央存储来解决这些问题。用户用名称保存每个秘密，任何插件都可以通过该名称引用它。

![[settings-secret-list.png]]

## 第 1 步：更新您的设置界面

从典型的插件设置开始。 `mySetting` 属性将存储秘密的*名称*，而不是秘密值本身。

```ts
import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "./main";

export interface MyPluginSettings {
  mySetting: string;
}
```

## 步骤 2：将 SecretComponent 添加到您的设置选项卡

将标准文本输入替换为“SecretComponent”。从 `obsidian` 导入 `SecretComponent` 并在 `Setting` 上使用 `addComponent` 方法：

```ts
import { App, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import MyPlugin from "./main";

export class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('API key')
      .setDesc('Select a secret from SecretStorage')
      .addComponent(el => new SecretComponent(this.app, el)
        .setValue(this.plugin.settings.mySetting)
        .onChange(value => {
          this.plugin.settings.mySetting = value;
          this.plugin.saveSettings();
        }));
  }
}
```

“SecretComponent”为用户提供了一个界面，可以从现有秘密中进行选择或创建新秘密。保存后，您的插件设置包含秘密的*名称*，而不是实际的秘密值。

![[settings-secretcomponent.png]]

## 步骤 3：检索秘密值

当您的插件需要实际的秘密值时，请使用“SecretStorage” API：

```ts
const secret = app.secretStorage.get(this.settings.mySetting);
if (secret) { // secret value might be null

}
```

这将检索与您的设置中存储的名称关联的秘密值。实际的秘密存储在本地存储中，并锁定到特定的保管库。

## 完整示例

这是完整的设置选项卡实现：

```ts
import { App, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import MyPlugin from "./main";

export interface MyPluginSettings {
  mySetting: string;
}

export class SampleSettingTab extends PluginSettingTab {
  plugin: MyPlugin;

  constructor(app: App, plugin: MyPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName('API key')
      .setDesc('Select a secret from SecretStorage')
      .addComponent(el => new SecretComponent(this.app, el)
        .setValue(this.plugin.settings.mySetting)
        .onChange(value => {
          this.plugin.settings.mySetting = value;
          this.plugin.saveSettings();
        }));
  }
}
```

## 常见问题解答

### 为什么 SecretComponent 使用 `addComponent` 而不是像 `addText` 这样有自己的方法？

与其他设置组件不同，“SecretComponent”需要其构造函数中的“App”实例才能访问 SecretStorage API。标准 `addText`、`addToggle` 和类似方法不会将 `App` 传递给它们的回调。 `Setting#addComponent` 方法使您可以完全控制组件实例化，允许您传递所需的 `App` 引用。
