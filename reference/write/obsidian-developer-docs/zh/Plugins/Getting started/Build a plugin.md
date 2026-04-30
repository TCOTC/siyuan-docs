借助插件，你可以用自建功能扩展 Obsidian，打造个性化的笔记体验。

在本教程中，你将从源代码编译一个示例插件，并载入 Obsidian。

## 你将学到什么

完成本教程后，你将能够：

- 配置用于开发 Obsidian 插件的环境。
- 从源代码编译插件。
- 在修改插件后重新加载插件。

## 前提条件

要完成本教程，你需要：

- 在本地安装 [Git](https://git-scm.com/)。
- 本地具备 [Node.js](https://Node.js.org/en/about/) 开发环境。
- 代码编辑器，例如 [Visual Studio Code](https://code.visualstudio.com/)。

## 开始之前

开发插件时，一次失误就可能意外改动你的库。为防止数据丢失，切勿在主库中开发插件；请始终使用专门用于插件开发的独立库。

[创建一个空库](https://help.obsidian.md/Getting+started/Create+a+vault#Create+empty+vault)。

## 步骤 1：下载示例插件

在此步骤中，你会把示例插件下载到库 [`.obsidian` 目录](https://help.obsidian.md/Advanced+topics/How+Obsidian+stores+data#Per+vault+data)下的 `plugins` 目录，以便 Obsidian 能找到它。

本教程使用的示例插件托管在 [GitHub 仓库](https://github.com/obsidianmd/obsidian-sample-plugin)。

1. 打开终端，将当前目录切换到 `plugins` 目录。

   ```bash
   cd path/to/vault
   mkdir .obsidian/plugins
   cd .obsidian/plugins
   ```

2. 使用 Git 克隆示例插件。

   ```bash
   git clone https://github.com/obsidianmd/obsidian-sample-plugin.git
   ```

> [!tip] GitHub 模板仓库
> 示例插件仓库是一个 GitHub 模板仓库，因此你可以基于示例插件创建自己的仓库。做法参见 [从模板创建仓库](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template#creating-a-repository-from-a-template)。
>
> 克隆示例插件时，请记得改用你自己仓库的 URL。

## 步骤 2：构建插件

在此步骤中，你要编译示例插件，以便 Obsidian 能够加载。

1. 进入插件目录。

   ```bash
   cd obsidian-sample-plugin
   ```

2. 安装依赖。

   ```bash
   npm install
   ```

3. 编译源代码。下列命令会在终端中持续运行，并在你修改源代码时重新构建插件。

   ```bash
   npm run dev
   ```

此时插件目录中应出现 `main.js` 文件，其中包含编译后的插件。

## 步骤 3：启用插件

要在 Obsidian 中加载插件，需要先启用它。

1. 在 Obsidian 中打开 **设置（Settings）**。
2. 在侧边菜单中选择 **社区插件（Community plugins）**。
3. 选择 **打开社区插件（Turn on community plugins）**。
4. 在 **已安装插件（Installed plugins）** 下，通过旁边的开关启用 **Sample Plugin（示例插件）**。

现在你可以在 Obsidian 中使用该插件。接下来我们会改动插件本身。

## 步骤 4：更新插件清单

在此步骤中，你要通过更新插件清单文件 `manifest.json` 来重命名插件。清单包含插件的名称、描述等信息。

1. 在代码编辑器中打开 `manifest.json`。
2. 将 `id` 改为唯一标识，例如 `"hello-world"`。
3. 将 `name` 改为人类可读名称，例如 `"Hello world"`。
4. 将插件文件夹重命名，使其与插件的 `id` 一致。
5. 重启 Obsidian，以加载对插件清单的更改。

回到 **已安装插件**，你会看到插件名称已反映你所做的修改。

每当修改 `manifest.json` 后，请记住重启 Obsidian。

## 步骤 5：更新源代码

为了让用户能与插件交互，请添加 _Ribbon 图标_：用户点击时会收到问候。

1. 在代码编辑器中打开 `main.ts`。
2. 将插件类名从 `MyPlugin` 改为 `HelloWorldPlugin`。
3. 从 `obsidian` 包导入 `Notice`（若尚未导入）。

   ```ts
   import { Notice, Plugin } from 'obsidian';
   ```

4. 在 `onload()` 方法中加入下列代码：

   ```ts
   this.addRibbonIcon('dice', 'Greet', () => {
     new Notice('Hello, world!');
   });
   ```

5. 在 **命令面板** 中选择 **在不保存的情况下重载应用（Reload app without saving）** 以重载插件。

此时 Obsidian 窗口左侧 Ribbon 上会出现骰子图标；点击它会在右上角显示一条提示。

请记住：**修改源代码后需要重新加载插件**，可以在社区插件面板中先关闭再打开该插件，也可以像本步骤第 5 部分那样使用命令面板。

> [!tip] 热重载
> 安装 [Hot-Reload](https://github.com/pjeby/hot-reload) 插件，可在开发过程中自动重载你的插件。

## 小结

在本教程中，你使用 TypeScript API 构建了第一个 Obsidian 插件；你还修改了插件并在 Obsidian 中重载以查看更改。
