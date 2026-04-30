---
source_url: https://www.writethedocs.org/writing/docs-principles/
source_file: docs/guide/writing/docs-principles.rst
license: CC BY-NC-SA 4.0
locale: zh-CN
---

# Documentation principles

软件开发受益于[各类软件哲学](https://en.wikipedia.org/wiki/Category:Software_development_philosophies)与[工程原则](https://en.wikipedia.org/wiki/Category:Programming_principles)，例如 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)、[KISS](https://en.wikipedia.org/wiki/KISS_principle)、[代码复用](https://en.wikipedia.org/wiki/Code_reuse) 等；开发者借助这些共识来写出高质量代码。

同样的思路也适用于软件**文档**：帮助内容保持清晰、直观，让读者能快速找到所需信息并获得掌控感。

## General documentation principles

所有文档工作都应做到……

- [Precursory](#precursory)
- [Participatory](#participatory)

### Precursory

*在动手开发之前就开始写文档。*

在写代码之前，先把需求与规格写出来，它们就是文档的第一版草稿。发布前当然需要润色，但把文档前置能为你指明清晰路线；早期文档也便于同伴评审与集体决策。这一思路与[文档驱动设计](../resources-for-creating-documentation/style-guides.md#documentation-driven-design)一脉相承。

### Participatory

*在文档流程中纳入从开发者到终端用户的所有人。*

把文档纳入开发者的日常工作流，打破「只有少数人负责文档」的孤岛。工程师最掌握一线信息，让他们参与撰写有助于形成真正的**文档文化**。

文档**读者**（用户）也应有参与渠道：从评论、建议开始；若开放直接编辑（例如 wiki），要权衡编辑治理的成本与收益。

鼓励**每个人**都成为 [documentarian](https://www.writethedocs.org/documentarians/)（文档人）！

## Principles for great content

*此处的「内容」指文档所承载的概念信息。*

**内容**应当……

- [ARID](#arid)
- [Skimmable](#skimmable)
- [Exemplary](#exemplary)
- [Consistent](#consistent)
- [Current](#current)

### ARID

*Accept (some) Repetition In Documentation —— 接受文档中出现（部分）重复。*

写好代码要 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)；但若把 DRY 机械搬到文档里，往往走不通：业务逻辑在代码里写了一遍，在文档里**仍然需要**再用自然语言解释一遍。

理想情况下，自动化工具能从源码生成**高质量**文档且无需人工补充；现实里最好的文档仍依赖人工撰写，这意味着「重复」不可避免。[文档生成器](http://en.wikipedia.org/wiki/Comparison_of_documentation_generators)很有用，但仍需人的输入。

目标是把重复**压到最低**；ARID 不是提倡 [WET](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself#DRY_vs_WET_solutions)，而是承认：文档需要一点「湿度」才能成立。意识到这一点，有助于提醒开发者：改代码时常常也要同步更新文档。

### Skimmable

*让读者能识别并跳过已掌握或与当下问题无关的概念。*

把关键信息埋在冗长叙述里，会浪费只想快速找答案的读者时间。请像写新闻那样组织内容，而不是写小说。

具体而言：

- **标题**——信息性强且简短。  
- **超链接**——锚文本应描述链接目标（避免「点击这里」「本页」之类）。  
- **段落与列表项**——尽早点出可识别的概念。

### Exemplary

*在内容中纳入（适量）示例与教程。*

许多读者会先看示例；示例要覆盖最常见场景，但不宜过多，否则会损害[可扫读性](#skimmable)。可考虑把示例/教程与高密度参考信息分区呈现。

### Consistent

*在语言与版式上保持一致。*

编辑者越多，[风格指南](../resources-for-creating-documentation/style-guides.md)就越重要。一致性同时提升[可扫读性](#skimmable)与[美观度](#beautiful)。

### Current

*宁可缺文档，也不要错误文档。*

软件迭代快于文档时，受害的是用户。尽量写版本无关、维护成本更低的内容（例如教程里出现版本号时做泛化处理）。

仍停留在旧版本的用户需要旧版文档；好的文档平台应能优雅支持多版本并行。

## Principles for content sources

*「来源」指存储与编辑内容的系统：reStructuredText / Markdown 纯文本、CMS 里的 HTML、嵌在应用代码字符串里的帮助文本、日后汇总成正式文档的代码注释等。*

所有**来源**都应……

- [Nearby](#nearby)
- [Unique](#unique)

### Nearby

*尽量把来源放在离所描述代码最近的地方。*

给开发者能「顺手改文档」的流程：例如把文档写在源码注释块里，或与代码放在同一仓库的独立文本文件中。目标是让开发与文档工作流尽可能合并。

### Unique

*消除不同来源之间的内容重叠。*

允许多来源并存，但每个来源的职责边界要清晰、互不重叠，避免同一段信息在多处平行维护（或更糟：无人维护）。

## Principles for publications

*「出版物」指读者消费文档时面对的一套完整载体：可以是静态或交互、数字或纸质。同一来源可生成多种出版物（如网站与 PDF）；也可能多来源合成单一出版物。例子包括：API 参考、`man`、命令行 `--help`、应用内提示、在线教程、内部工程手册等。*

每个**出版物**都应……

- [Discoverable](#discoverable)
- [Addressable](#addressable)
- [Cumulative](#cumulative)
- [Complete](#complete)
- [Beautiful](#beautiful)

### Discoverable

*在所有用户可能寻找帮助的路径上，把他们自然引导到出版物。*

找出用户可能去找文档的每个入口，并在这些位置放置清晰指针；未必处处都放完整文档，但要有**指路牌**。

若手册发布在无人知晓的角落，那它几乎等于不存在——这就是[可发现性](https://en.wikipedia.org/wiki/Discoverability)。

### Addressable

*提供能直达细粒度内容的地址。*

能引用文档深处的具体章节，会极大提升讨论、反馈与自我检索的效率（URL、页码等形式均可）。越细粒度、越容易访问越好。

### Cumulative

*内容顺序应让前置概念先于依赖它的内容出现。*

读者能否从头到尾线性阅读而不迷路？若能，则文档「累积性」很好——虽非总能做到，但在教程与示例中值得追求。若教程与参考分离，通常应把教程置前；参考区可按字母或主题排序。

累积排序的目的不是强迫线性阅读，而是帮助读者在补知识缺口时能「往回找」。若读者从中间开始读，遇到困惑往往会向前回溯。

### Complete

*在每个出版物内部：要么把一个概念讲全，要么干脆不提。*

把文档想象成街区地图：若地图画路，就应画**该类**道路的全部；可以不画铁路，但找铁路的读者会换地图——地图仍算「完整」。完整不等于描述土地的一切特征；而是：既然选择描述某类要素，就要**穷尽该类要素**。标出 50 个消防栓却漏掉另外 50 个，比完全不标更糟。

例如 `iconv` 的 [man page](http://man7.org/linux/man-pages/man1/iconv.1.html) 覆盖全部选项，但不枚举所有编码取值，而是让用户运行 `iconv -l` 查看列表——两份出版物各司其职，各自完整。

若必须发布未完成的文档，务必在显著位置说明覆盖范围有限。

### Beautiful

*视觉风格应经过设计，并具备美感。*

并非人人都在意审美，但缺乏版式关怀的文档会让部分读者难以建立信任。即便是纯文本的 `--help`，也存在间距与大小写等「风格」问题。若你本人不在意，可以请在意的人协助改进。

## Principles for the body of publications

*「文档体」指某个软件项目及其子项目下全部出版物的集合。*

整个文档**体**应当……

- [Comprehensive](#comprehensive)

### Comprehensive

*确保所有出版物合在一起，能回答用户**很可能**提出的主要问题。*

我们不可能覆盖所有冷门问题，但覆盖「高概率问题」是可实现的，也应作为目标。「高概率」虽模糊，却是相对的：若文档体大量笔墨花在极冷门问题上，却漏掉常见问题，就失衡了。

有些答案需要读者跨多份出版物拼起来，这是可以接受的。
