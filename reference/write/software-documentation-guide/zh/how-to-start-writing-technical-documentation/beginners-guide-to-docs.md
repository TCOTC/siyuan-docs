---
source_url: https://www.writethedocs.org/writing/beginners-guide-to-docs/
source_file: docs/guide/writing/beginners-guide-to-docs.rst
license: CC BY-NC-SA 4.0
locale: zh-CN
---

# 如何撰写软件文档

作为软件开发者或工程师，公开发布开源代码时常常会有一种复杂感受：既兴奋又忐忑。你想让世界了解新项目，却不知从何写起。即便是职业写作者，面对空白页面也会五味杂陈。

好的软件文档能减轻这种不安。别害怕！按本指南去做，你就能为首次公开发布的项目写好文档。

<a id="why-write-software-documentation"></a>

## 为什么要写软件文档？

### 半年后的你还能读懂自己的代码

半年前的代码看起来就像别人写的；当时显而易见的东西，如今可能已模糊，你也会更理解「潜在用户需要好文档」这件事。

### 让别人真正用上你的代码

就像代码注释解释「为什么」而不是「怎么做」，软件文档阐明代码背后的「为什么」。好文档能化解人们不用你项目的常见理由：

- 不知道项目解决什么问题、如何满足需求。
- 找不到安装方法。
- 看不出如何使用。

所以，若你在乎自己的项目，就写文档，让别人能用起来。

### 吸引更多人贡献代码

潜在贡献者需要文档来上手；文档也提供了除改代码之外的参与方式，对从未贡献过开源的人而言，改文档往往比改代码门槛更低。没有文档，你会阻碍甚至流失贡献者。

### 改进代码本身

写文档时的专注思考会促进设计。把 API 与设计决策写下来，有助于你系统梳理思路；别人也更容易按你的原意提交代码。

### 提升技术写作能力

技术写作对程序员很有用，但它与多数人天生的写作习惯不同。持续写文档会锻炼这项能力，而且越写越顺——所以请坚持为项目写文档。

从简单开始，效果最好。

<a id="what-to-include-in-software-documentation"></a>

## 软件文档应包含哪些内容？

给用户他们需要的信息，但不要过量。

先想清楚常见读者属于哪一类：

- **用户**：只想用你的代码，不关心实现细节。
- **开发者**：想为你的项目贡献代码。

另外，**不要把 FAQ 当成长期文档的主力**。FAQ 适合项目早期临时说明，但很快会暴露出许多问题：

- 内容迅速过时。
- 把互不相关的话题堆在一起。
- 条目多了以后难以检索与排序。
- 往往并不是「真实用户最常问」的问题列表。
- 容易让人用「随手补一条 FAQ」代替认真写文档。

### 说明你的代码解决什么问题

读者通过文档了解项目：可能来自他人推荐，也可能来自搜索引擎。无论如何，都要清楚说明项目是做什么的、为什么值得用。

[Fabric](http://docs.fabfile.org/) 在这方面做得很好。

### 提供简短可运行的示例

展示一个常见用法即可。

[Requests](https://requests.kennethreitz.org/en/master/) 是很好的范例。

### 链接到代码与问题追踪

有人会浏览源码，也可能想提交 bug，因此要让参与路径清晰。

[The Python Guide](http://docs.python-guide.org/en/latest/index.html) 做得不错。

### 说明如何获得支持

无论是邮件列表还是 IRC，写清楚如何求助、如何与社区互动。

[Django](https://docs.djangoproject.com/en/1.8/faq/help) 在这方面很出色。

### 说明如何贡献

大家对「如何贡献」有不同预期。把流程写清楚，贡献就更可能符合项目规范。

[Open Comparison](https://packaginator.readthedocs.io/en/latest/contributing.html) 是不错的例子。

### 提供安装说明

当别人决定采用你的项目时，需要能安装并运行。基础安装步骤尽量控制在几行内，并链接到更详细的说明与注意事项页面。

[Read the Docs](https://docs.readthedocs.com/dev/latest/install.html) 的安装说明值得参考。

### 写明许可证

BSD？MIT？GPL？许可证对你或许无所谓，但打算使用你代码的人会在意。想清楚你想通过许可证达成什么目标，并尽量采用常见、被广泛理解的标准许可证。

<a id="next-steps-for-software-documentation"></a>

## 软件文档的后续步骤

按本指南做完之后，你的项目就更有机会被顺利采用。若还想深入，可阅读 [如何维护开源项目](https://medium.com/p/aaa2a5437d3a)（Medium，英文）。

<a id="tools-for-writing-software-documentation"></a>

## 撰写软件文档的工具

程序员生活在纯文本世界里；文档工具链也应同样基于纯文本、同时强大且易用。写作工具应能把纯文本变成美观的 HTML，并能跟踪文件变更。

### 一个简单的标记示例

    Resources
    ---------

    * Online documentation: http://docs.writethedocs.org/
    * Conference: http://conf.writethedocs.org/

这样会渲染出清晰的 HTML 标题与带超链接的列表；作为纯文本阅读也仍然直观。

> **关于标记语言**：下文示例同时符合 [Markdown](http://daringfireball.net/projects/markdown/) 与 [reStructuredText](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html) 的常见写法；也可参阅本站镜像的 [Markdown 简介](../understanding-markup-languages/markdown.md) 与 [reStructuredText 简介](../understanding-markup-languages/reStructuredText.md)。

### README 模板

README 往往是用户第一次接触项目的地方，因此值得认真打磨。代码托管平台会在你使用正确扩展名时自动把 README 渲染成 HTML。

也有人提倡 [README 驱动开发](http://tom.preston-werner.com/2010/08/23/readme-driven-development.html)。

下面是一个简单的 `README` 起点模板。若使用 Markdown，将文件命名为 `README.md`；若使用 reStructuredText，则命名为 `README.rst`。

    $project
    ========

    $project solves the problem of where to start with documentation
    by providing a basic explanation of how to do it easily:

        import project
        # Get your stuff done
        project.do_stuff()

    Features
    --------

    - Be awesome
    - Make things faster

    Installation
    ------------

    Install $project by running:

        install project

    Contribute
    ----------

    - Issue Tracker: github.com/$project/$project/issues
    - Source Code: github.com/$project/$project

    Support
    -------

    Let us know if you have issues.
    See our mailing list at: project@google-groups.com

    License
    -------

    The project is licensed under the BSD license.
