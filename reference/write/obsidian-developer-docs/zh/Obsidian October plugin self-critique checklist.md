---
description: A checklist for plugin developers to self-critique their plugins.
permalink: oo/plugin
aliases:
  - oo24/plugin
---
## 发布和命名

- [ ] 删除占位符名称，例如“MyPlugin”和“SampleSettingTab”。
- [ ] 不要在您的名字中包含“Obsidian”一词，除非它绝对有意义。大多数时候它是多余的。
- [ ] 不要在命令名称中包含您的插件名称。 Obsidian 为您添加了这个。
- [ ] 不要在命令前加上您的插件 ID。 Obsidian 为您添加了这个。
- [ ] 不要在您的存储库中包含 `main.js`。仅将其包含在您的版本中。
- [ ] 如果还没有，请考虑添加一个“fundingUrl”，以便您的插件的用户可以表示一些支持。 [了解更多](https://docs.obsidian.md/Reference/Manifest#fundingUrl)。

## 兼容性

- [ ] 不提供命令的默认热键。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid+setting+a+default+hotkey+for+commands)。
- [ ] 不要覆盖核心样式。如果需要，添加您自己的类并使样式仅适用于您的类。
- [ ] 请扫描您的代码以查找已弃用的方法（它们通常在 IDE 中显示为删除线文本）。
- [ ] 不要通过 JavaScript 或 HTML 分配样式。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#No+hardcoded+styling)。
- [ ] 如果需要访问配置目录，请不要访问硬编码的“.obsidian”文件夹。该位置可以自定义，因此请使用“Vault.configDir”。

## 移动支持

如果您在清单中将“isDesktopOnly”设置为 false，请完成此部分。

- [ ] 不要在顶层使用 Node.js 模块，例如 `fs`、`path` 或 `electron`。如果需要，可以在运行时动态地控制“Platform.isDesktopApp”和“require()”背后的功能。
- [ ] 如果您想支持低于 16.4 的 iOS 版本，请不要使用正则表达式lookbehinds（如果您不在插件中使用正则表达式，请忽略此选项）。 [了解更多](https://docs.obsidian.md/Plugins/Getting+started/Mobile+development#Lookbehind+in+regular+expressions)。
- [ ] 不要将 `Vault.adapter` 强制转换为 `FileSystemAdapter`。 “FileSystemAdapter”的所有使用都应该在“instanceof”检查之后进行。在移动设备上，“Vault.adapter”将是“CapacitorAdapter”的实例。
- [ ] 不要使用 `process.platform`，而是使用 Obsidian 的 `Platform`。 [API 链接](https://docs.obsidian.md/Reference/TypeScript+API/Platform)。
- [ ] 不要使用 `fetch` 或 `axios.get`，而是使用 Obsidian 的 `requestUrl`。 [API 链接](https://docs.obsidian.md/Reference/TypeScript+API/requestUrl)。

## 编码风格

- [ ] 不要使用 `var`。请改用 `let` 或 `const`。 [了解更多](https://javascript.plainenglish.io/4-reasons-why-var-is-considered-obsolete-in-modern-javascript-a30296b5f08f)。
- [ ] 不要使用全局 `app` 实例。请使用提供给您的插件实例的“this.app”。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid%20using%20global%20app%20instance)。
- [ ] 如果“main.ts”变大，请将其分解为较小的文件甚至文件夹，以使代码更易于查找。
- [ ] 为了可读性，请尽可能使用 `async` 和 `await`，而不是使用 `Promise`。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Prefer+async%2Fawait+over+Promise)。
- [ ] 不要使用全局变量。尝试将变量保留在类或函数的范围内。 [了解更多](http://wiki.c2.com/?GlobalVariablesAreBad)。
- [ ] 在转换为其他类型（例如“TFile”、“TFolder”或“FileSystemAdapter”）之前，请先使用“instanceof”进行测试。
- [ ] 不要使用 `as any` 并使用正确的类型来代替。

## 安全

- [ ] 请在自述文件中[披露相关信息](https://docs.obsidian.md/Developer+policies#Disclosures)（付款、账户要求、网络使用、外部文件访问、广告、隐私政策遥测、封闭源代码）。
- [ ] 请注意您添加到插件中的所有依赖项。请记住[越少越安全](https://obsidian.md/blog/less-is-safer/)。 
- [ ] 不包括任何客户端遥测。提供使用跟踪和指标的图书馆通常会收集用户可能认为敏感的信息。
- [ ] 在使用包管理器（npm、pnpm 或yarn）时提交并使用锁定文件（package-lock.json、pnpm-lock.yaml 或yarn.lock）。

## API 使用- [ ] 不要使用`Vault.modify`。如果您想编辑活动文件，最好使用“编辑器”界面。如果您想在后台编辑它，请使用“Vault.process”。
- [ ] 不要手动读写 frontmatter。相反，请使用“FileManager.processFrontMatter”。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Prefer+%60FileManager.processFrontMatter%60+to+modify+frontmatter+of+a+note)。
- [ ] 不要使用 `vault.delete` 来删除文件。请改用 `trashFile` 以确保根据用户首选项删除文件。 [了解更多](https://docs.obsidian.md/Reference/TypeScript+API/FileManager/trashFile)。
- [ ] 尽可能不要使用`Adapter` API。请改用“Vault” API。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Prefer+the+Vault+API+over+the+Adapter+API)。
- [ ] 不要自己管理插件数据的读写。请改用 `Plugin.loadData()` 和 `Plugin.saveData()`。
- [ ] 如果您采用用户定义的路径，请使用“normalizePath()”。 [了解更多](https://docs.obsidian.md/Reference/TypeScript+API/normalizePath)。


## 性能

- [ ] 优化插件的加载时间。 [[Optimize plugin load time|See guide]]。
- [ ] 不要迭代所有文件以按路径查找文件或文件夹。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid+iteating+all+files+to+find+a+file+by+its+path)。
- [ ] 如果您希望您的插件与 Obsidian 1.7.2+ 兼容，请更新您的插件以与“DeferredViews”配合使用。 [[Defer views|See guide]]。
- [ ] 如果您使用 `moment`，请确保执行 `import { moment} from 'obsidian'`，这样就不会导入另一个副本。
- [ ] 请最小化您的“main.js”以进行发布。
- [ ] 在 `workspace.onLayoutReady()` 上进行初始 UI 设置，而不是在构造函数或 `onload()` 函数中。 [了解更多](https://docs.obsidian.md/Plugins/Guides/Optimizing+plugin+load+time#If+you+have+code+that+you+want+to+run+at+startup%2C+where+should+it+go%3F)。

## 用户界面

- [ ] 不要使用设置标题，除非您有多个部分。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Only+use+headings+under+settings+if+you+have+more+than+one+section)。
- [ ] 设置标题中不要包含“设置”或“选项”一词。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Avoid+%22settings%22+in+settings+headings)。
- [ ] 请在 UI 元素中的所有文本中使用句子大小写，以与 Obsidian UI 的其余部分保持一致。 [了解更多](https://en.wiktionary.org/wiki/sentence_case)。
- [ ] 不要使用`<h1>`或`<h2>`来设置标题。请改用黑曜石 API。 [了解更多](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines#Use+%60setHeading%60+instead+of+a+%60%3Ch1%3E%60%2C+%60%3Ch2%3E%60)。
- [ ] 除非绝对必要，否则不要执行 `console.log`。删除生产不需要的测试控制台日志。
