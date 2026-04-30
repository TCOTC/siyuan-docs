---
aliases:
  - Plugins/Guides/Understanding+deferred+views
permalink: plugins/guides/defer-views
---
从 Obsidian v1.7.2 开始，当 Obsidian 加载时，所有视图都会创建为 **DeferredView** 的实例。一旦视图在屏幕上可见（即在其包含的选项卡组中选择该选项卡），“leaf”将重新渲染，并且视图将切换到正确的“View”实例。

此更改可能会打破您的插件当前所做的一些假设。

### 访问 `leaf.view`

如果您的插件正在迭代工作区（使用“iterateAllLeaves”或“getLeavesOfType”），那么现在非常重要的是，在对“leaf.view”做出任何假设之前执行“instanceof”检查。

```ts
// Bad
workspace.iterateAllLeaves(leaf => {
    if (leaf.view.getViewType() === 'my-view') {
        let view = leaf.view as MyCustomView;
        ...
    }
});

// Good
workspace.iterateAllLeaves(leaf => {
    if (leaf.view instanceof MyCustomView) {
        ...
    }
});
```

```ts
// Bad
let leaf = workspace.getLeavesOfType('my-view').first();
if (leaf) {
	let view = leaf.view as MyCustomView;
}
...

// Good
let leaf = workspace.getLeavesOfType('my-view').first();
if (leaf && leaf.view instanceof MyCustomView) {
    ...
}
```

这将避免您的插件因对工作空间做出错误的假设而被破坏并导致您的插件出错。

### 在工作区的任何位置访问您的“CustomView”

> 要遵循的一般规则：如果您的插件尝试与视图通信，则该视图应该可见。

如果您的插件需要访问工作区中的“CustomView”实例，您可能会注意到前面的代码片段将不起作用。

对于大多数用例，解决方案很简单：

```ts
let leaf = workspace.getLeavesOfType('my-view').first();
if (leaf) {
	await workspace.revealLeaf(leaf); // Ensure the view is visible, `await` it to make sure the view is fully loaded
	if (leaf.view instanceof MyCustomView) {
		let view = leaf.view; // You now have your CustomView
	}
}
```

对于大多数情况，这将是处理访问自定义视图的正确方法。

### 访问您的“CustomView”而不显示（高级）

在某些情况下，您希望访问视图而不显示它。例如，如果您的插件正在对现有视图类型应用修改。

在这种情况下，您将需要手动请求加载视图。

```ts
let leaves = workspace.getLeavesOfType('my-view');
for (let leaf of leaves) {
  if (requireApiVersion('1.7.2')) {
    await leaf.loadIfDeferred(); // Ensure view is fully loaded
  }
  // perform modifications here...
}
```

> [!Warning] 性能警告
> 手动调用 `loadIfDeferred`，您的插件将从给定视图中删除此性能优化。 *谨慎使用这个*。
