---
aliases:
  - Plugins/Guides/Optimizing+plugin+load+time
permalink: plugins/guides/load-time
---
插件在应用程序加载时间中发挥着重要作用。为了确保 Obsidian 正常运行，Obsidian 会在用户与应用程序交互之前加载所有插件。

您可以通过**设置**→**常规**→**高级**来测试Obsidian的启动时间。并选择秒表图标来调试启动时间。此视图指示应用程序启动所需的时间。

### 如何缩短插件的加载时间？

- 简化您的插件“onload”。
- 检查您的插件视图构造函数。
- 避免[常见陷阱](#Pitfalls)。

首先，简单的事情。确保您使用的是插件的生产版本。如果您使用 esbuild、rollup 或 webpack 等捆绑器，您可能会创建“开发”构建或“生产”构建。生产版本通常会更小，加载速度更快，并删除仅用于测试的代码。创建版本时，请确保“main.js”文件是生产版本。

在构建配置中，您应该考虑缩小插件代码。这将使整个插件文件大小更小，因此插件从磁盘读取和加载的速度更快。

接下来，确保您没有在插件的“onload”函数中执行任何昂贵的操作。 `onload` 函数应该只包含插件初始化所需的代码。这包括应用程序注册，例如注册命令、视图类型和 Markdown 后处理器。它不应包含任何计算成本较高或数据获取的内容。

如果您的插件创建任何自定义视图，请注意您的自定义视图构造函数。当 Obsidian 打开时，它将重新打开保存到用户工作区的所有视图。如果您的视图已加载（而不是 [[Defer views|deferred]]），这将直接影响应用加载时间。

### 如果您有想要在启动时运行的代码，它应该放在哪里？

在大多数情况下，您需要将代码包装在“onLayoutReady”回调中。这些回调会被延迟，并且仅在 Obsidian 完成加载后调用。

## 陷阱

### 监听 `vault.on('create')`

作为 Obsidian 的 Vault 初始化过程的一部分，它将为每个文件调用“create”。如果您的插件需要对创建的新文件做出反应，您需要先等待工作区准备好。您的保管库事件注册应该在“onLayoutReady”回调内；这将确保您在工作区完全初始化之前不会开始对事件做出反应。

#### 选项 A. 检查布局是否准备就绪

```ts
class MyPlugin extends Plugin {
    onload(app: App) {
	    super(app);
        this.registerEvent(this.app.vault.on('create', this.onCreate, this));
    }

	onCreate() {
	    if (!this.app.workspace.layoutReady) {
	      // Workspace is still loading, do nothing
	      return;
	    }
		// ...
	}
}
```

#### 选项 B. 布局准备好后注册处理程序

```ts
class MyPlugin extends Plugin {
    onload(app: App) {
	    super(app);
	    this.app.workspace.onLayoutReady(() => {
	        this.registerEvent(this.app.vault.on('create', this.onCreate, this));
	    });
    }

	onCreate() {
		// ...
	}
}
```

如需优化插件的更多帮助，请联系[[Home#Join the developer community|help from the developer community]]！
