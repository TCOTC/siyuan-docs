如果您想与 Obsidian 社区分享您的插件，最好的方法是将其提交到[官方插件列表](https://github.com/obsidianmd/obsidian-releases/blob/master/community-plugins.json)。一旦我们审核并发布了您的插件，用户就可以直接从 Obsidian 中安装它。它还将出现在 Obsidian 网站的 [插件目录](https://obsidian.md/plugins) 中。

您只需要提交插件的初始版本。插件发布后，用户可以直接在 Obsidian 中从 GitHub 下载新版本。

## 先决条件

要完成本指南，您需要：

- 一个 [GitHub](https://github.com/signup) 帐户。

## 开始之前

在提交插件之前，请确保存储库的根文件夹中有以下文件：

- 描述插件用途以及如何使用它的“README.md”。
- 一个“许可证”，决定如何允许其他人使用该插件及其源代码。如果您需要帮助为您的插件[添加许可证](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-license-to-a-repository)，请参阅[选择许可证](https://choosealicense.com/)。
- 描述您的插件的“manifest.json”。如需了解更多信息，请参阅[[Manifest]]。

另请确保在提交插件之前遵循[[Developer policies]]和[[Submission requirements for plugins|submission requirements]]。

## 第 1 步：将您的插件发布到 GitHub

> [!note] 模板存储库
> 如果您从我们的模板存储库之一创建插件，则可以跳过此步骤。

要查看您的插件，我们需要访问 GitHub 上的源代码。如果您不熟悉 GitHub，请参阅 GitHub 文档了解如何[创建新存储库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository)。

## 第 2 步：创建版本

在此步骤中，您将为准备提交的插件准备一个版本。

1. 在“manifest.json”中，将“version”更新为遵循[语义版本控制](https://semver.org/)规范的新版本，例如初始版本的“1.0.0”。仅支持“x.y.z”格式的版本。
2. [创建 GitHub 版本](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release)。版本的“标签版本”必须与“manifest.json”中的版本匹配。
3. 输入版本的名称，并在描述字段中进行描述。 Obsidian 不使用任何版本的名称，因此您可以随意命名它。
4. 将以下插件资源作为二进制附件上传到发行版：

   - `main.js`
   - `manifest.json`
   - `styles.css`（可选）

## 步骤 3：提交您的插件以供审核

在此步骤中，您将把插件提交给 Obsidian 团队进行审核。

1. 在 [community-plugins.json](https://github.com/obsidianmd/obsidian-releases/edit/master/community-plugins.json) 中，在 JSON 数组的末尾添加一个新条目。

   ```json
   {
     "id": "doggo-dictation",
     "name": "Doggo Dictation",
     "author": "John Dolittle",
     "description": "Transcribes dog speech into notes.",
     "repo": "drdolittle/doggo-dictation"
   }
   ```

   - `id`、`name`、`author` 和 `description` 决定了您的插件向用户显示的方式，并且应与 [[Manifest]] 中的相应属性相匹配。
   - `id` 对于您的插件来说是唯一的。搜索 `community-plugins.json` 以确认不存在具有相同 ID 的现有插件。 `id` 不能包含 `obsidian`。
   - `repo` 是 GitHub 存储库的路径。例如，如果您的 GitHub 存储库位于 https://github.com/your-username/your-repo-name，则路径为 `your-username/your-repo-name`。

   请记住在上一个条目的右大括号“}”后添加逗号。

2. 选择右上角的“**提交更改...**”。
3. 选择**建议更改**。
4. 选择 **创建拉取请求**。
5. 选择“**预览**”，然后选择“**社区插件**”。
6. 单击 **创建拉取请求**。
7. 在拉取请求的名称中，输入“添加插件：[...]”，其中 [...] 是您的插件的名称。
8. 在拉取请求的描述中填写详细信息。对于复选框，在方括号“[x]”之间插入“x”，将其标记为已完成。
9. 单击**创建拉取请求**（最后一次🤞）。

您现在已将插件提交到 Obsidian 插件目录。请坐下来等待我们友好的机器人进行初步验证。结果可能需要几分钟才能准备好。

- 如果您在 PR 上看到 **准备审核** 标签，则您的提交已通过自动验证。
- 如果您在 PR 上看到 **验证失败** 标签，则需要解决所有列出的问题，直到机器人分配 **准备审核** 标签。

一旦您的提交准备好接受审核，您就可以坐下来等待 Obsidian 团队对其进行审核。

> [!question] 审核我的插件需要多长时间？
> 审核您提交的内容所需的时间取决于 Obsidian 团队当前的工作量。该团队还很小，所以请耐心等待您的插件被审核。目前，我们无法预估何时能够审核您提交的内容。

> [!warning] 忽略合并冲突
> 如果您在 PR GitHub 中看到警告“此分支存在必须解决的冲突”，请忽略它。不要合并或改变你的 PR。
> 一旦您的插件通过了所有审核，Obsidian 团队将在发布您的插件之前解决这些冲突。

## 步骤 4：处理审核意见

审阅者审阅您的插件后，他们将在您的拉取请求中添加评论以及审阅结果。审阅者可能会要求您更新插件，或者他们可以提供有关如何改进插件的建议。

解决任何所需的更改并使用新更改更新 GitHub 版本。请在 PR 上发表评论，让我们知道您已处理了反馈。不要打开新的 PR。

一旦我们验证所有必需的更改均已得到解决，我们将发布该插件。

> [!note]
> 虽然只有 Obsidian 团队成员可以发布您的插件，但其他社区成员也可能会同时审核您提交的内容。

## 后续步骤

一旦我们审核并发布了您的插件，就该向社区宣布它了：

- 在论坛的[分享和展示](https://forum.obsidian.md/c/share-showcase/9)中发布。
- 在 [Discord](https://discord.gg/veuWUTm) 上的“#updates”频道中发布。您需要[`developer`角色](https://discord.com/channels/686053708261228577/702717892533157999/830492034807758859)才能在`#updates`中发布。
