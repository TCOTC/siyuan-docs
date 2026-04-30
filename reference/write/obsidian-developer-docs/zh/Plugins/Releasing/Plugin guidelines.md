此页面列出了插件作者在提交插件时收到的常见评论评论。

虽然本页上的指南只是建议，但根据其严重程度，我们仍可能要求您解决任何违规行为。

> [!important] 插件开发者政策
> 确保您已阅读我们的[[Developer policies]]以及[[Submission requirements for plugins]]。

## 一般

### 避免使用全局应用程序实例

避免使用全局应用程序对象“app”（或“window.app”）。相反，请使用插件实例“this.app”提供的引用。

全局应用程序对象用于调试目的，将来可能会被删除。

### 避免不必要的日志记录到控制台

请避免不必要的日志记录。
在默认配置中，开发人员控制台应仅显示错误消息，不应显示调试消息。

### 考虑使用文件夹组织代码库

如果您的插件使用多个“.ts”文件，请考虑将它们组织到文件夹中，以便更轻松地查看和维护。

### 重命名占位符类名

示例插件包含常见类的占位符名称，例如“MyPlugin”、“MyPluginSettings”和“SampleSettingTab”。重命名它们以反映您的插件的名称。

## 手机
![[Mobile development#Node and Electron APIs]]

![[Mobile development#Lookbehind in regular expressions]]
## 用户界面文本

本节列出了用户界面中文本格式的指南，例如设置、命令和按钮。

下面来自**设置 → 外观**的示例演示了用户界面中文本的准则。

![[settings-headings.png]]

1. [[#Only use headings under settings if you have more than one section.|General settings are at the top and don't have a heading]]。
2. [[#Avoid "settings" in settings headings|Section headings don't have "settings" in the heading text]]。
3. [[#Use Sentence case in UI]]。

有关为 Obsidian 编写和格式化文本的更多信息，请参阅我们的[样式指南](https://help.obsidian.md/Contributing+to+Obsidian/Style+guide)。

### 仅当您有多个部分时才使用设置下的标题。

避免在设置选项卡中添加顶级标题，例如“常规”、“设置”或插件的名称。

如果“设置”下有多个部分，其中一个部分包含常规设置，请将它们保留在顶部而不添加标题。

例如，查看**设置 → 外观**下的设置。

### 避免在设置标题中使用“设置”

在设置选项卡中，您可以添加标题来组织设置。避免在这些标题中包含“设置”一词。由于设置选项卡下的所有内容都是设置，因此为每个标题重复它就变得多余了。

- 优先选择“高级”而不是“高级设置”。
- 优先选择“模板”而不是“模板设置”。

### 在 UI 中使用句子大小写

UI 元素中的任何文本都应使用 [句子大小写](https://en.wiktionary.org/wiki/sentence_case) 而不是 [标题大小写](https://en.wikipedia.org/wiki/Title_case)，其中只有句子中的第一个单词和专有名词应大写。

- 优先选择“模板文件夹位置”而不是“模板文件夹位置”。
- 优先选择“创建新笔记”而不是“创建新笔记”。

### 使用 `setHeading` 代替 `<h1>`、`<h2>`

使用 HTML 中的标题元素将导致不同插件之间的样式不一致。
相反，您应该更喜欢以下内容：
```ts
new Setting(containerEl).setName('your heading title').setHeading();
```
## 安全

### 避免使用 `innerHTML`、`outerHTML` 和 `insertAdjacentHTML`

使用“innerHTML”、“outerHTML”和“insertAdjacentHTML”从用户定义的输入构建 DOM 元素可能会带来安全风险。

以下示例使用包含用户输入“${name}”的字符串构建 DOM 元素。 “name”可以包含其他 DOM 元素，例如“<script>alert()</script>”，并且可以允许潜在的攻击者在用户计算机上执行任意代码。

```ts
function showName(name: string) {
  let containerElement = document.querySelector('.my-container');
  // DON'T DO THIS
  containerElement.innerHTML = `<div class="my-class"><b>Your name is: </b>${name}</div>`;
}
```

相反，请使用 DOM API 或 Obsidian 辅助函数，例如“createEl()”、“createDiv()”和“createSpan()”以编程方式构建 DOM 元素。如需了解更多信息，请参阅[[HTML elements]]。

要清理 HTML 元素内容，请使用 `el.empty();`

## 资源管理

### 插件卸载时清理资源

插件创建的任何资源（例如事件侦听器）必须在插件卸载时销毁或释放。

如果可能，请使用 [[registerEvent|registerEvent()]] 或 [[addCommand|addCommand()]] 等方法在插件卸载时自动清理资源。

```ts
export default class MyPlugin extends Plugin {
  onload() {
    this.registerEvent(this.app.vault.on('create', this.onCreate));
  }

  onCreate: (file: TAbstractFile) => {
    // ...
  }
}
```

> [!note]
> 您不需要清理在插件卸载时保证被删除的资源。例如，如果您在 DOM 元素上注册“mouseenter”侦听器，则当该元素超出范围时，该事件侦听器将被垃圾收集。

### 不要在`onunload`中分离叶子

当用户更新您的插件时，任何打开的叶子都将在其原始位置重新初始化，无论用户将其移动到何处。

## 命令

### 避免为命令设置默认热键

设置默认热键可能会导致插件之间发生冲突，并且可能会覆盖用户已经配置的热键。

选择适用于所有操作系统的默认热键也很困难。

### 对命令使用适当的回调类型

当您在插件中添加命令时，请使用适当的回调类型。

- 如果命令无条件运行，则使用“回调”。
- 如果命令仅在特定条件下运行，请使用“checkCallback”。

如果该命令需要打开且活动的 Markdown 编辑器，请使用“editorCallback”或相应的“editorCheckCallback”。

## 工作区

### 避免直接访问`workspace.activeLeaf`

如果您想访问活动视图，请使用 [[getActiveViewOfType|getActiveViewOfType()]] 代替：

```ts
const view = this.app.workspace.getActiveViewOfType(MarkdownView);

// getActiveViewOfType will return null if the active view is null, or if it's not a MarkdownView.
if (view) {
  // ...
}
```

如果您想访问活动笔记中的编辑器，请使用“activeEditor”：

```ts
const editor = this.app.workspace.activeEditor?.editor;

if (editor) {
    // ...
}
```

### 避免管理对自定义视图的引用

管理对自定义视图的引用可能会导致内存泄漏或意外后果。

**不要**这样做：

```ts
this.registerView(MY_VIEW_TYPE, () => this.view = new MyCustomView());
```

改为这样做：

```ts
this.registerView(MY_VIEW_TYPE, () => new MyCustomView());
```

要从插件访问视图，请使用“Workspace.getActiveLeavesOfType()”：

```ts
for (let leaf of app.workspace.getActiveLeavesOfType(MY_VIEW_TYPE)) {
  let view = leaf.view;
  if (view instanceof MyCustomView) {
    // ...
  }
}
```

## 金库

### 对于活动文件，首选编辑器 API，而不是“Vault.modify”

如果您想编辑活动笔记，请使用[[Editor]]界面而不是[[Vault/modify|Vault.modify()]]。

编辑器维护有关活动注释的信息，例如光标位置、选择和折叠内容。当您使用[[Vault/modify|Vault.modify()]]编辑注释时，所有信息都会丢失，这会导致用户体验不佳。

编辑器在对笔记的某些部分进行小的更改时也更加高效。

### 更喜欢使用 `Vault.process` 而不是 `Vault.modify` 在后台修改文件

如果您想要编辑当前未打开的注释，请使用[[Reference/TypeScript API/Vault/process|Vault.process]]函数而不是[[modify|Vault.modify]]。

“process”函数自动修改文件，这意味着您的插件不会与修改同一文件的其他插件发生冲突。

### 首选 `FileManager.processFrontMatter` 来修改笔记的 frontmatter

您应该使用 [[processFrontMatter|FileManager.processFrontMatter]] 函数，而不是提取注释的 frontmatter、手动解析和修改 YAML。

`processFrontMatter` 以原子方式运行，因此修改文件不会与编辑同一文件的其他插件发生冲突。
它还将确保生成的 YAML 布局一致。

### 优先选择 Vault API 而不是 Adapter API

Obsidian 公开了两个用于文件操作的 API：Vault API (`app.vault`) 和 Adapter API (`app.vault.adapter`)。

虽然许多开发人员通常更熟悉适配器 API 中的文件操作，但 Vault API 相对于适配器有两个主要优点。

- **性能：** Vault API 有一个缓存层，当 Obsidian 已知文件时，可以加快文件读取速度。
- **安全：** Vault API 连续执行文件操作以避免任何竞争条件，例如在读取同时写入的文件时。

### 避免迭代所有文件以通过路径查找文件

这是低效的，尤其是对于大型金库。请改用[[getFileByPath|Vault.getFileByPath]]、[[getFolderByPath|Vault.getFolderByPath]] 或[[getAbstractFileByPath|Vault.getAbstractFileByPath]]。

**不要**这样做：

```ts
this.app.vault.getFiles().find(file => file.path === filePath);
```

改为这样做：

```ts
const filePath = 'folder/file.md';
// if you want to get a file
const file = this.app.vault.getFileByPath(filePath);
```

```ts
const folderPath = 'folder';
// or if you want to get a folder
const folder = this.app.vault.getFolderByPath(folderPath);
```

如果您不确定提供的路径是文件夹还是文件，请使用：
```ts
const abstractFile = this.app.vault.getAbstractFileByPath(filePath);

if (file instanceof TFile) {
	// it's a file
}
if (file instanceof TFolder) {
	// it's a folder
}
```

### 使用 `normalizePath()` 清理用户定义的路径

每当您接受库中文件或文件夹的用户定义路径，或者在插件代码中构造自己的路径时，请使用 [[normalizePath|normalizePath()]]。

`normalizePath()` 获取一个路径并对其进行清理，以确保文件系统和跨平台使用的安全。这个功能：

- 清理正斜杠和反斜杠的使用，例如用单个“/”替换 1 个或多个“\”或“/”。
- 删除前导和尾随的向前和向后斜杠。
- 将所有不间断空格“\u00A0”替换为常规空格。
- 通过 [String.prototype.normalize](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize) 运行路径。

```ts
import { normalizePath } from 'obsidian';
const pathToPlugin = normalizePath('//my-folder\file');
// pathToPlugin contains "my-folder/file" not "//my-folder\"
```

## 编辑器

### 更改或重新配置编辑器扩展

如果您在使用 [[registerEditorExtension|registerEditorExtension()]] 注册后想要更改或重新配置 [[Editor extensions|editor extension]]，请使用 [[updateOptions|updateOptions()]] 更新所有编辑器。

```ts
class MyPlugin extends Plugin {
  private editorExtension: Extension[] = [];

  onload() {
    //...

    this.registerEditorExtension(this.editorExtension);
  }

  updateEditorExtension() {
    // Empty the array while keeping the same reference
    // (Don't create a new array here)
    this.editorExtension.length = 0;

    // Create new editor extension
    let myNewExtension = this.createEditorExtension();
    // Add it to the array
    this.editorExtension.push(myNewExtension);

    // Flush the changes to all editors
    this.app.workspace.updateOptions();
  }
}

```
## 造型

### 无硬编码样式

**不要**这样做：

```ts
const el = containerEl.createDiv();
el.style.color = 'white';
el.style.backgroundColor = 'red';
```

为了让用户轻松修改插件的样式，您应该使用 CSS 类，因为在插件代码中对样式进行硬编码使得无法使用主题和片段进行修改。

**这样做**：

```ts
const el = containerEl.createDiv({cls: 'warning-container'});
```

 在插件 CSS 中添加以下内容：

```css
.warning-container {
	color: var(--text-normal);
	background-color: var(--background-modifier-error);
}
```

为了使插件的样式与 Obsidian 和其他插件一致，您应该使用 Obsidian 提供的 [[CSS variables]]。
如果没有适合您情况的可用变量，您可以创建自己的变量。

## 打字稿

### 优先选择 `const` 和 `let` 而不是 `var`

有关更多信息，请参阅[现代 JavaScript 中 var 被视为过时的 4 个原因](https://javascript.plainenglish.io/4-reasons-why-var-is-considered-obsolete-in-modern-javascript-a30296b5f08f)。

### 优先选择 async/await 而不是 Promise

最新版本的 JavaScript 和 TypeScript 支持“async”和“await”关键字来异步运行代码，这使得代码比使用 Promises 更具可读性。

**不要**这样做：

```ts
function test(): Promise<string | null> {
  return requestUrl('https://example.com')
    .then(res => res.text
    .catch(e => {
      console.log(e);
      return null;
    });
}
```

改为这样做：

```ts
async function AsyncTest(): Promise<string | null> {
  try {
    let res = await requestUrl('https://example.com');
    let text = await r.text;
    return text;
  }
  catch (e) {
    console.log(e);
    return null;
  }
}
```
