手动发布插件可能非常耗时且容易出错。在本指南中，您将配置插件以使用 [GitHub Actions](https://github.com/features/actions) 在创建新标签时自动创建版本。

1. 在插件的根目录中，在 `.github/workflows` 下创建一个名为 `release.yml` 的文件，其中包含以下内容：

   ```yml
   name: Release Obsidian plugin

   on:
     push:
       tags:
         - "*"

   jobs:
     build:
       runs-on: ubuntu-latest
       permissions:
         contents: write
       steps:
         - uses: actions/checkout@v3

         - name: Use Node.js
           uses: actions/setup-node@v3
           with:
             node-version: "18.x"

         - name: Build plugin
           run: |
             npm install
             npm run build

         - name: Create release
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
           run: |
             tag="${GITHUB_REF#refs/tags/}"

             gh release create "$tag" \
               --title="$tag" \
               --draft \
               main.js manifest.json styles.css
   ```

2. 在您的终端中，提交工作流程。

   ```bash
   git add .github/workflows/release.yml
   git commit -m "Add release workflow"
   git push origin main
   ```

3. 浏览到 GitHub 上的存储库并选择 **设置** 选项卡。展开左侧边栏中的 **操作** 菜单，导航到 **常规** 菜单，滚动到 **工作流程权限** 部分，选择 **读写权限** 选项，然后保存。

4. 创建与“manifest.json”文件中的版本匹配的标签。

   ```bash
   git tag -a 1.0.1 -m "1.0.1"
   git push origin 1.0.1
   ```

   - `-a` 创建一个[带注释的标签](https://git-scm.com/book/en/v2/Git-Basics-Tagging#_creating_tags)。
   - `-m` 指定您的版本的名称。对于 Obsidian 插件，这必须与版本相同。

5. 浏览到 GitHub 上的存储库并选择 **操作** 选项卡。您的工作流程可能仍在运行，或者可能已经完成。

6. 工作流程完成后，返回存储库主页并在右侧边栏中选择“**发布**”。该工作流程已创建草稿 GitHub 版本，并将所需的资产作为二进制附件上传。

7. 选择版本名称右侧的“**编辑**”（铅笔图标）。

8. 添加发行说明，让用户了解此版本中发生了什么，然后选择**发布版本**。

您已成功将插件设置为在创建新标签时自动创建 GitHub 版本。

- 如果这是该插件的第一个版本，您现在就可以[[Submit your plugin]]。
- 如果这是对已发布插件的更新，您的用户现在可以更新到最新版本。
