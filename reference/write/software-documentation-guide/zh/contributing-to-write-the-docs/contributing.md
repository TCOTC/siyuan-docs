---
source_url: https://www.writethedocs.org/contributing/
source_file: docs/guide/contributing.rst
license: CC BY-NC-SA 4.0
locale: zh-CN
---

# Contributing to the Write the Docs guide

欢迎！Write the Docs 的指南旨在覆盖软件文档的方方面面。若你想贡献内容，请先阅读本页，了解指南的定位与协作方式。

## How to contribute

无论职业背景或工具经验如何，任何人都可以贡献；只要尊重现有成果与维护者的时间，你的贡献都会受到认真对待。

常见参与方式：

- [在 GitHub 网页界面直接编辑单篇指南](#editing-a-single-guide-via-the-github-ui)。  
- [使用 Git 编辑文件并提交 PR](#updating-a-guide-via-a-pull-request)。  
- [提交 GitHub issue](https://github.com/writethedocs/www/issues/new) 建议小改动、新增内容，或指出既有内容的问题。

## What to contribute

我们尤其欢迎以下方向的补充：

- [API 文档工具与最佳实践](../software-documentation-guide.md#how-to-write-api-documentation)。  
- 文档最佳实践。  
- 开发者工具、docs-as-code 工具链与工作流。  
- 对常见工具的高层次讨论。

若你想在当前指南结构下组织新主题，可到 [Slack](../write-the-docs-resources/slack.md) 询问，或[提交 issue](https://github.com/writethedocs/www/issues/new)。

## Contribution guidelines

- 保持友好、鼓励的语气——写「关于文档的文档」时，这同样重要。  
- 引用链接时请说明其价值。  
- 正文可使用 [reStructuredText (.rst)](../understanding-markup-languages/reStructuredText.md)（也接受 [Markdown](../understanding-markup-languages/markdown.md)）。  
- 聚焦通用原则与最佳实践，避免在细枝末节上争论。  
- 避免把个人偏好写成硬性规则；若推荐某种措辞，请解释它为何重要。

讨论工具时还需要注意：

- 确保内容对广泛读者有意义。  
- 避免过度推销个人偏好的工具链，即便它是开源的。  
- 多写具体场景、问题如何被解决、哪些做法有效或无效。  
- 重大改动前可先[提交 issue](https://github.com/writethedocs/www/issues/new) 或邮件联系 guide@writethedocs.org。

## Editing a single guide via the GitHub UI

1. 在 [Write the Docs www 仓库](https://github.com/writethedocs/www) 中找到你想改进的文件。  

例如 `/docs/documentarians.rst` 对应站点页面 <https://www.writethedocs.org/documentarians/>。

2. 根据文件所用标记语言查看排版约定。例如 `/docs/documentarians.rst` 使用 [reStructuredText (.rst)](../understanding-markup-languages/reStructuredText.md)。  
3. 点击铅笔图标，在你 fork 的仓库中编辑。  
4. 保存修改。  
5. 点击 **Commit changes...**。  
6. 点击 **Propose changes**。  
7. 点击 **Create pull request**。

## Updating a guide via a pull request

若你还不熟悉 Git/GitHub，可按本节入门。

### Before you begin

1. [注册 GitHub 账号](https://github.com/join)。  
2. [下载并安装 Git](https://git-scm.com/downloads)。  
3. 打开终端，按 GitHub 文档[配置用户名](https://help.github.com/en/articles/setting-your-username-in-git)。  
    1. macOS：打开 **Terminal**。  
    2. Windows：从开始菜单打开 **Git Bash**。  
4. 在 [www 仓库](https://github.com/writethedocs/www) 中找到与 [issue](https://github.com/writethedocs/www/issues) 或你想改进的页面对应的文件。  

例如 `/docs/documentarians.rst` 对应 <https://www.writethedocs.org/documentarians/>。

5. 根据文件所用标记语言查看排版约定；上例使用 [reStructuredText (.rst)](../understanding-markup-languages/reStructuredText.md)。

### Create a pull request with your changes

**在 GitHub 网页上：**

1. [Fork www 仓库](https://github.com/writethedocs/www/fork)。  
2. 点击 **Create fork**。  
3. 点击 **<> Code**。  
4. 复制 HTTPS 克隆地址。

**在终端中：**

1. 打开终端（macOS：**Terminal**；Windows：**Git Bash**）。  
2. 进入用于存放克隆仓库的目录。  
3. 输入 `git clone ` 并粘贴仓库地址，例如：

    > git clone https://github.com/myname/www.git

4. 进入 `www` 目录：`cd www`。  
5. 创建分支：`git branch branch-name`（用简短英文描述你的改动）。  
6. 切换分支：`git checkout branch-name`。

**在编辑器中（如 [Sublime Text](https://www.sublimetext.com) 或 [VS Code](https://code.visualstudio.com/)）：**

1. 打开并编辑目标文件后保存。

**回到终端：**

1. `git status` 查看改动。  
2. `git add -A` 暂存。  
3. `git commit -m "Your message"` 提交（参考[如何写好 commit message](https://chris.beams.io/posts/git-commit/)）。  
4. `git push -u origin branch-name` 推送到你的 fork。  
5. 在 GitHub 上创建 [Pull Request](https://help.github.com/en/articles/creating-a-pull-request)。

## Community

如需帮助、提问或讨论：

- [Slack](../write-the-docs-resources/slack.md)  
- [会议](https://www.writethedocs.org/conf/)  
- [本地 meetup](https://www.writethedocs.org/meetups)  
- [Newsletter](https://www.writethedocs.org/newsletter/)
