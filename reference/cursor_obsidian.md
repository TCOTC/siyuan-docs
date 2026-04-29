# Obsidian 开发文档参考
_Exported on 2026/4/29 at GMT+8 16:59:53 from Cursor (3.2.16)_

---

**User**

我想参考 https://github.com/obsidianmd/obsidian-developer-docs 做个思源笔记的开发文档，现在我需要先了解 https://github.com/obsidianmd/obsidian-developer-docs 项目

---

**Cursor**

正在了解 obsidian-developer-docs 仓库的结构与运作方式，并查看你的工作区是否已有相关克隆。



继续从 GitHub 获取仓库的目录结构与关键配置。



下面是对 [obsidianmd/obsidian-developer-docs](https://github.com/obsidianmd/obsidian-developer-docs) 的整理，方便你后面做「思源笔记开发文档」时对照取舍。

---

## 项目定位

这是一个 **Obsidian 库（vault）**：正文几乎都是 Markdown，用 Obsidian 打开整个仓库即可编辑。线上站点是 [docs.obsidian.md](https://docs.obsidian.md/)，对应 Obsidian 的 **Publish** 一类托管方式（库根目录下的 `en/publish.css`、`favicon` 等也服务于发布样式与站点图标）。

仓库说明见 [README](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/README.md)：小改可直接 PR；较大内容变更建议先开 issue；并需遵守官方 [Style guide](https://help.obsidian.md/Contributing+to+Obsidian/Style+guide)。

---

## 顶层目录在干什么

| 路径 | 作用 |
|------|------|
| **`en/`** | 英文文档主体（可理解为「语言根目录」）。入口页是 `Home.md`，下面再分 Plugins、Themes、Reference 等。 |
| **`config/`** | **从 TypeScript 定义生成 API 参考文档** 的脚本与配置（见下文）。 |
| **`.obsidian/`** | Obsidian 配置（例如 snippets），与编辑体验相关。 |
| **`.github/workflows/`** | CI：主要是自动生成 TypeScript API 文档并开 PR。 |
| **`rushstack`** | 仓库里是一个 **文件**（指向/配合 workflow 里克隆的 rushstack），用于在 Action 里本地编 `api-extractor` / `api-documenter`。 |

另外还有 `.editorconfig`、`.gitignore` 等常规工程文件。

---

## `en/` 里的信息架构（最值得抄「结构」）

- **`Home.md`**：首页；用 YAML frontmatter（如 `cssclasses`）控制展示；正文用 **Obsidian 维基链接** `[[页面名|显示文字]]` 串起站内导航。
- **`Plugins/`**：插件开发——含 *Getting started*、*Guides*、*User interface*、*Editor*、*Releasing* 等子文件夹，再加若干单页（如 `Events.md`、`Vault.md`）。
- **`Themes/`**：主题相关。
- **`Reference/`**：参考级内容——如 `Manifest.md`、`Versions.md`、**`CSS variables/`**、以及机器生成的 **`TypeScript API/`**。
- **`Assets/`**：图片等资源。
- **`Developer policies.md`**、各类 **October 自检清单**：政策与活动文档，不是核心 API，但说明他们也会把「上架规范 / 自检」写进同一库。

对你做思源文档的启发：同样可以 **`zh-Hans/`（或 `zh_CN/`）+ `Home.md` + 插件 / 主题 / 参考 / 资源** 分层；首页用内部链接把主线串起来。

---

## `config/`：API 文档怎么来的

[config/README.md](https://github.com/obsidianmd/obsidian-developer-docs/blob/main/config/README.md) 写得很清楚：

1. 用 **Microsoft API Extractor** 从 `obsidian.d.ts`（与 [obsidian-api](https://github.com/obsidianmd/obsidian-api) 同步）生成 `.api.json`。
2. 再用 **api-documenter** 生成 Markdown，输出到 **`en/Reference/TypeScript API`**。
3. 还有 **`pre-process.js` / `post-process.js`**、**`gendoc.sh`**，在生成前后做格式或链接上的修整。

README 里特别说明：`References/TypeScript API`（实际路径是 `Reference/TypeScript API`）**不接受手工改 PR**，只接受 issue；和主仓库 [README 里的 Warning](https://github.com/obsidianmd/obsidian-developer-docs#readme) 一致。

---

## GitHub Actions（`build-typescript-docs.yml`）

- 触发方式：**`workflow_dispatch`**（手动跑），不是每次 push 都生成。
- 步骤概要：拉最新 `obsidian.d.ts` → clone **rushstack fork** 并 `rush build` → 在 `config` 里跑 api-extractor → pre-process → api-documenter → post-process → 调整输出文件名 → **`git diff`** → 机器人分支 **commit + push + `gh pr create`**。

思源若也有「从 `.d.ts` 或内核接口生成参考」，可以借鉴这种 **「生成物单独目录 + CI 只开 PR、人不直接改生成文件」** 的流程；生成工具不一定用 Rushstack，Typedoc 等也可以。

---

## 协作与编辑方式（README）

官方推荐流程：**Fork → 用 Obsidian「打开文件夹作为库」→ 在库里改 → 用阅读模式检查 → 提交到自己的 fork → 向上游提 PR**。  
也就是说，**产品即文档载体**：不是 Docusaurus/VitePress 那种「先写 MDX 再 build」，而是 **Obsidian 为第一编辑环境**（发布时再 Publish）。

---

## 和「思源笔记开发文档」的对应关系（简要）

| Obsidian 做法 | 思源侧可考虑的点 |
|---------------|------------------|
| 库 + Markdown + 维基链接 | 思源库同样适合存文档；链接语法是 `((id))` 或 `[text](path)`，需统一规范。 |
| `en/` 语言根 | 可用 `zh-Hans/` 等单语言或双语目录。 |
| Plugins / Themes / Reference 分层 | 对齐思源的插件（内核 API）、主题、数据/API 参考等实际模块。 |
| `config/` + API Extractor 生成 TS API | 若思源提供官方 `.d.ts` 或 OpenAPI，可用 Typedoc、自定义脚本等生成「只读参考」目录。 |
| Publish + `publish.css` | 思源可选用「导出 HTML」、静态站、或官方文档站，样式单独维护。 |

你当前工作区 `siyuan-developer-docs` 里还没有文件；若要 **本地对照**，可直接 `git clone https://github.com/obsidianmd/obsidian-developer-docs.git` 后用 Obsidian 打开，结构会最直观。

如果你下一步想细化成「思源文档的目录树草案」或「是否也用库 + 自动生成 API 两轨」，可以说一下你更偏向 **纯思源库** 还是 **库 + 独立文档站**，我可以按那个方向帮你拆一版具体结构。

---

**User**

我想生成跟 ob 的开发文档网站一样的网站，这个有开源吗

---

**Cursor**

正在查证 Obsidian Publish 是否开源及有哪些可替代的静态站点方案。



结论可以分两层说：

## 1. 文档「内容」仓库：开源

[obsidianmd/obsidian-developer-docs](https://github.com/obsidianmd/obsidian-developer-docs) 是开源的（MIT 等以仓库 LICENSE 为准）。里面是 Markdown 库结构、样式（如 `en/publish.css`）、资源文件等，你可以 fork、改、再发布到自己的站点。

## 2. 和 docs.obsidian.md 一样的那套「网站引擎」：不是开源产品

[docs.obsidian.md](https://docs.obsidian.md/) 用的是官方 **Obsidian Publish** 托管：在 Obsidian 里配置发布，由 Obsidian 的服务器渲染、搜索、导航等。**Publish 本身是商业订阅服务**，没有官方开源的「和线上一模一样的 Publish 服务端」给你自建。

所以：**“跟 OB 开发文档站一样的站”若指「同一套 Publish 产品」→ 没有开源替代品是官方同款；若指「观感/结构类似的文档站」→ 可以自己做。**

## 3. 想要「类似效果」时常见开源路线

思路都是：**Markdown 库 + 静态站或自托管渲染**（必要时把 `[[链接]]`、callout 等用构建链转换）。

| 方向 | 说明 |
|------|------|
| **通用静态文档** | [VitePress](https://vitepress.dev/)、[Docusaurus](https://docusaurus.io/)、[MkDocs](https://www.mkdocs.org/) 等，结构清晰、搜索好做，但要自己从 vault 习惯迁到「目录 + 侧边栏配置」。 |
| **偏 Obsidian 语法的发布** | 社区里有「类 Publish」的自托管方案，例如 [mdbrain](https://github.com/blackstorm/mdbrain)、[obsidian-userland/publish](https://github.com/obsidian-userland/publish) 等（成熟度、协议、功能各自不同，需自己评估）。 |
| **数字花园 / Quartz 一类** | 很多人用 [Quartz](https://github.com/jackyzha0/quartz) 等把 Obsidian 库打成静态站，视觉和双链可以做得接近「知识库站点」，但和官方 Publish 仍不是同一套 UI。 |

对你做 **思源开发文档**：通常更省事的是 **VitePress / Docusaurus + 自己的 Markdown**，不必绑 Obsidian Publish；若坚持「库即仓库、维基链接」，再在构建脚本里做链接解析即可。

如果你愿意说下更在意 **「长得像 docs.obsidian.md」** 还是 **「搜索/版本/多语言」**，可以收窄到 1～2 种具体技术选型（仍用中文说明）。

---

**User**

帮我多收集一些不同风格的开发者文档网站，创建一个 md 文档列出来，我一个个看一下

---

**Cursor**

正在创建一份分类整理的 Markdown 清单，收录多种风格的开发者文档站点并附简短说明与链接。



已在你的项目里新建清单文件：

**路径：** [`/Users/jeffrey/CodeProjects/siyuan-developer-docs/developer-documentation-sites-inspiration.md`](file:///Users/jeffrey/CodeProjects/siyuan-developer-docs/developer-documentation-sites-inspiration.md)

**内容结构概览：**

1. **商业 / API 文档** — Stripe、Twilio、Cloudflare、Linear、Notion 等（强导航、参考表、多产品分册）  
2. **开源框架官方** — React、Vue、Svelte、Astro、Rust、Go、Python、K8s、MDN 等（手册 vs API 电话簿）  
3. **云厂商** — AWS、GCP、Learn、Terraform Registry 等  
4. **数据 / ORM** — Prisma、Supabase、Hasura、PostgreSQL  
5. **UI / CSS** — Tailwind、Radix、shadcn、MUI  
6. **示例驱动** — Three.js、p5.js、Godot  
7. **文档引擎本身** — VitePress、Docusaurus、Starlight、Nextra、MkDocs Material 等（做站时对标实现）  
8. **笔记类产品** — Obsidian Help / Developer Docs  
9. **方法论** — Diátaxis、Write the Docs  

每个条目都有 **链接 + 一两句「风格要点」**，方便你按块浏览。文末有一段简短使用建议。若要再加一类（例如「桌面应用扩展」「游戏模组」「思源官方已有文档」），可以说一下我帮你补一节进同一个 md。

---

**User**

@reference/idea.md:3-5 linear 的网站有开源吗？

---

**Cursor**

**没有。** 你在 `idea.md` 里参考的 [Linear 开发者文档站](https://linear.app/developers/sdk)（以及 [developers.linear.app](https://developers.linear.app/docs) 这一套）的 **网站前端 / 文档站主题本身并未开源**，不能 fork 出「同一套官方 UI」来自建。

**有开源的是「SDK 与相关工具」**，不是文档站皮肤：

- 仓库：[github.com/linear/linear](https://github.com/linear/linear)（MIT）
- 内容主要是 `@linear/sdk`、import 工具、GraphQL codegen 插件等；README 也写明完整文档以 **developers.linear.app** 为准。

若你想做出 **白底、黑字、细线框** 那种观感，只能 **自己用组件库 / 文档框架仿视觉**（例如 Nextra、VitePress 自定义主题、或纯 Next.js + MDX），对标的是设计语言，而不是某个开源的「Linear Docs 模板」。

---

**User**

如果我要部署一个 GitHub page 并且是要从 Markdown 生成网站，主流有哪些方案？

---

**Cursor**

从 Markdown 到静态站再挂 **GitHub Pages**，主流可以按「技术栈 / 心智模型」分成几类（都是：本地或 CI 里 `build` → 把 `dist` 推到 Pages，或推 `gh-pages` 分支）。

## 1. GitHub Pages「原生」路线

- **[Jekyll](https://jekyllrb.com/)**  
  历史上和 Pages 绑定最深：仓库根或 `/docs` 用 Jekyll，**可不开 Actions**（仍支持经典流程；复杂需求很多人改用 Actions 构建）。适合博客、简单文档，主题是 Ruby 生态。

## 2. 前端 / Node 生态（近年文档站最常见）

- **[VitePress](https://vitepress.dev/)**（Vue + Vite）  
  Markdown 为主、默认主题就很像「产品文档」；构建结果是纯静态，和 Pages 很合拍。

- **[Docusaurus](https://docusaurus.io/)**（React）  
  版本化文档、博客、i18n 成熟；同样输出静态目录。

- **[Astro](https://astro.build/)** + Starlight 等  
  `content collections` 管 Markdown/MDX；输出静态，灵活度高。

- **[Nextra](https://nextra.site/)**（Next.js + MDX）  
  要挂 Pages 需 **`output: 'export'`** 等静态导出，和部署在 Vercel 上相比会少一些服务端能力，但文档类站点通常够用。

- **[Eleventy (11ty)](https://www.11ty.dev/)**  
  模板引擎选择多，Markdown 只是其中一种数据源，适合「站型」偏定制的项目。

## 3. Python 文档线（偏「手册 / API」）

- **[MkDocs](https://www.mkdocs.org/)**，常见主题是 **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)**  
  单 `mkdocs.yml` + `docs/*.md`，CI 里 `mkdocs build`，把 `site/` 交给 Pages。

- **[Sphinx](https://www.sphinx-doc.org/)**  
  reStructuredText 为主，也可接 Markdown；Python、C 项目文档很多，主题成熟。

## 4. 极速静态站「泛用」生成器

- **[Hugo](https://gohugo.io/)**（Go）  
  单二进制、构建极快；内容默认 Markdown，主题海量，适合博客 + 文档混合。

- **[Hexo](https://hexo.io/)**（Node）  
  中文社区用得很多，主题多，同样是 MD → 静态 HTML。

## 5. 书籍 / 长文结构

- **[mdBook](https://rust-lang.github.io/mdBook/)**（Rust）  
  `SUMMARY.md` 驱动章节，适合手册、教程书式站点。

## 6. Obsidian / 双链向（仍落静态）

- **[Quartz](https://github.com/jackyzha0/quartz)** 等  
  从「库式」Markdown（含 wiki 链接）生成静态站，再部署到 Pages。

---

## 和 GitHub Pages 的配合方式（共性）

1. **构建**：在 GitHub Actions（或本地）执行上述工具的 `build`。  
2. **发布**：把生成目录（如 `dist`、`build`、`site`、`_site`）用 [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages) 或 [JamesIves/github-pages-deploy-action](https://github.com/JamesIves/github-pages-deploy-action) 推到 `gh-pages` 分支，或使用 **GitHub Actions 的 `deploy-pages`** 上传 artifact（官方「静态站点」工作流）。

若你**没有强绑定 Vue/React**，只想快速、好看、维护成本低：**MkDocs Material** 或 **VitePress** 是当下最常被选的「Markdown → 文档站」两条主线；要**和思源/ Obsidian 库同构**，再看 **Quartz / 自定义 11ty**。

---

**User**

我需要本地能看到网站效果、能部署到 GitHub page、能从 Markdown 生成文档（可能会需要支持自定义为使用思源本身的 lute 引擎）、linear 风格（可能要自行实现整个网站的界面），你推荐什么方案

---

**Cursor**

下面按你的约束（**本地预览、GitHub Pages、Markdown 源、可能要接 Lute、Linear 风且多半全自研界面**）给一个可直接拍板的推荐顺序。

## 首选：**Astro（`output: 'static'`）+ 自建页面壳**

**理由（和你的需求一一对应）：**

| 需求 | Astro 为什么合适 |
|------|------------------|
| 本地看站 | `pnpm dev`，热更新成熟。 |
| GitHub Pages | 纯静态输出，配好 `base`（若是 `*.github.io/仓库名/`）即可用 Actions 部署。 |
| Markdown 生成 | 可用 **Content Collections** 管 `.md`；也可不用内置 MD，改成 **自己 glob 文件 + 在构建里生成 HTML**。 |
| Lute | 内置管线是 **可绕开** 的：适合在 **Vite 插件** 或 **小脚本** 里调用你的渲染器；不把主题绑死在 `markdown-it` / MDX 默认链上。 |
| Linear 风全自研 | 就是普通组件 + CSS；没有 Docusaurus/VitePress 那层「文档主题」要拆掉。 |

Lute 本体是 **Go**（[88250/lute](https://github.com/88250/lute)），和 Node 的常见接法是：**构建期**用 `go` 编译好的小 CLI / `cgo` 以外的方式，例如：

- 子进程调用 `lute`（或小封装）把 `.md` → HTML 片段写入缓存目录，再由 Astro 当「已渲染 HTML」组装进布局；或  
- 若你们已有 / 计划提供 **WASM 或浏览器端包**，本地 `dev` 和 CI 可统一走同一实现。

这样 **「文档站框架」和「Markdown 语义引擎」解耦**，以后换 Lute 版本也不动整站路由。

---

## 备选：**Vite + React（或 Vue）+ 极薄一层路由**

若你团队更熟 SPA、不想要 Astro 的「多模式」心智负担：

- 用 **Vite** 做开发与 build，**静态托管到 Pages** 同样顺滑。  
- Markdown：同样用 **Vite 插件** 在 `transform` 阶段调 Lute（或先占位用 `unified`，再替换）。  
- Linear 风：整站自己写，没有框架默认皮。

代价是：**目录、侧边栏、全文搜索、锚点** 等都要自己接或选库拼，比 Astro Content Collections 略费工。

---

## 不太建议作为默认起点

- **VitePress / Docusaurus**：默认 **强绑定各自 Markdown/MDX 栈和主题结构**，要做「整站 Linear 自定义 + 可换 Lute」等于长期和框架抢方向盘，除非你愿意大量 hack / 主题魔改。  
- **纯 MkDocs Material**：本地预览和 Pages 都简单，但 **换 Lute** 要改 Python 侧渲染链，和「全自研 Linear UI」也不如 JS 栈顺手。

---

## 实施上建议遵守的两条

1. **渲染策略**：**构建期出 HTML**（SEO、Pages、速度都好）；若 Lute 只在浏览器 WASM 里跑，再考虑客户端 hydration 或混合。  
2. **仓库里**：`base` / `site` 与 GitHub Pages 的 **子路径** 一致，避免线上资源路径断掉。

---

## 一句话结论

在「**Linear 级全自定义 UI + 将来可能必须用 Lute**」前提下，更省心的是 **Astro 静态站 + 自建 UI + 构建期可插拔渲染（Lute CLI / WASM）**；若更想完全掌控构建链，用 **Vite + 自研壳 + 同一套 Lute 接入** 也可以。

如果你愿意补充两点：**文档是单语言还是中英**、**仓库是 `username.github.io` 根域还是项目页**，可以把 `base`、i18n 和目录结构再收敛成一版具体目录草案（仍可不写代码，只给结构）。

---

**User**

Astro 介绍说是服务器优先的，这适合 GitHub page 吗

---

**Cursor**

适合。**「服务器优先」说的是组件和渲染思路，不是说你必须有一台长期在线的 Node 服务器。**

## Astro 和 GitHub Pages 怎么对上

- Astro 可以配置 **`output: 'static'`**（纯静态）：构建时就把页面打成 **HTML + CSS + JS**，和 VitePress、普通 Vite 一样，**没有服务端运行时**。
- 这种产物直接丢给 **GitHub Pages**（只提供静态文件托管）完全匹配。

「服务器优先」在文档里的含义主要是：

- 默认尽量在 **构建时 / 请求时（若你用 SSR 托管）** 产出 HTML，而不是整页都是客户端 React；
- 需要交互的地方用 **群岛（islands）** 按需加少量客户端 JS。

静态模式下，「服务器」那一面主要体现在 **build 阶段在 Node 里跑**，build 完以后和 GitHub Pages 无关。

## 什么时候不适合直接丢 Pages

若你用 **`output: 'server'`** 或 **`hybrid`** 且依赖 **SSR、服务端 API、按需服务端路由**，那是给 **Node / Cloudflare / Vercel** 这类有运行时的平台用的，**不能**指望默认的 GitHub Pages 跑 Astro 服务器。

---

**结论：** 做文档站、部署到 GitHub Pages 时，用 **Astro 静态输出（`output: 'static'`）** 即可；和「服务器优先」的宣传不冲突，也不会要求 Pages 提供 Node。创建项目时注意模板或 `astro.config` 里是静态模式即可。

---

**User**

简单做一版看看效果

---

**Cursor**

查看项目目录结构，接着用 Astro 搭建一版可本地预览、风格偏 Linear 的静态文档站。



正在添加 Content Collections、Linear 风格布局与 GitHub Pages 部署工作流。



迁移到 Astro 6 的 `content.config.ts` 与 `glob` loader，并将 `slug` 改为 `id`。



已经搭好一版可构建的 **Astro 静态站**，放在仓库的 **`site/`** 目录里。

## 包含内容

- **Linear 向界面**：白底、近黑正文、`#e5e5e5` 细边框、系统无衬线字体；顶栏 + 文档侧栏 + 正文区。
- **Markdown 文档**：`src/content/docs/` 下两篇示例（`welcome.md`、`plugin-overview.md`），使用 Astro 6 的 **`src/content.config.ts` + `glob` loader**。
- **路由**：首页 `/`，文档 `/docs/<文件名不含扩展名>`（例如 `/docs/welcome`）。
- **GitHub Pages**：根目录 **`.github/workflows/deploy-site.yml`**，在 `main` 分支推送且变更在 `site/` 时构建；构建时设置 `ASTRO_BASE_PATH=/<仓库名>`，与 **项目站** `https://<用户>.github.io/<仓库名>/` 对齐。需在仓库 **Settings → Pages** 里把源改成 **GitHub Actions**。

## 你怎么预览

在终端执行（按你的习惯由你本机跑即可）：

```bash
cd site && pnpm dev
```

浏览器打开 CLI 里给出的地址（一般是 `http://localhost:4321`）。

构建已在当前环境跑通：`pnpm build` → 产物在 **`site/dist/`**。

## 关键文件

| 路径 | 作用 |
|------|------|
| `site/src/layouts/Shell.astro` | 顶栏 + 侧栏壳 |
| `site/src/styles/global.css` | Linear 向样式 |
| `site/src/content.config.ts` | 文档集合与 Zod 字段 |
| `site/src/pages/docs/[...slug].astro` | 文档页（`render()` 来自 `astro:content`，符合 Astro 6） |
| `site/astro.config.mjs` | `output: 'static'`，可选 `ASTRO_BASE_PATH` |
| `site/README.md` | 本地 / Pages / base 说明 |

之后若要接 **Lute**，只需在构建链里把「Markdown → HTML」这一步从默认 `render()` 换成你的实现，壳子可以不动。若你希望默认分支不是 `main` 或 Pages 要用根域名仓库，可以说一下我再帮你改 Workflow 里的分支和 `ASTRO_BASE_PATH` 逻辑。

---

**User**

参考这个截图，让网站视觉再更接近 linear。另外还有一个文档 @reference/linear.app.md 。左上角的 LOGO 你可以用 @reference/ 里的 siyuan.png 文件

---

**Cursor**

正在阅读 `reference/linear.app.md` 与当前站点结构，以实现更接近 Linear 的三栏布局与思源 LOGO。



正在将 `siyuan.png` 复制到 `site/public`，并重构布局为三栏（左导航、正文、右侧目录），采用接近 Linear 开发者文档的浅色界面。



正在实现三栏布局、面包屑、工具栏、右侧 TOC（由 `render` 的 `headings` 生成），并接入 Inter 与 `linear.app.md` 中的浅色与 OpenType 设定。



已按 Linear 开发者文档的 **浅色三栏结构** 做了加强，并结合 `reference/linear.app.md` 里的 **Inter、`cv01`/`ss03`、细边框与层级色**（在浅色文档语境下映射为 `#f7f8f8`、`#e6e6e6` 等）。思源 LOGO 已从 `reference/siyuan.png` 复制到 `site/public/siyuan.png`，左上角与顶栏均使用该图。

## 改动摘要

1. **`site/src/layouts/Shell.astro`**
   - 文档页：**左栏**（LOGO + 品牌名、搜索框样式、带图标的文档列表、底部分割线与链接）、**中栏**（顶条：面包屑 + 复制链接按钮 +「了解思源」黑底主按钮）、**右栏**（本页目录，左侧竖线 + 当前段左边框强调）。
   - 首页：保留 **顶栏**（LOGO + 链接），下方居中 hero。
   - 引入 **Google Fonts Inter**，与 `linear.app.md` 一致加上 `font-feature-settings: 'cv01', 'ss03'`（写在 `global.css` 的 `body` 上）。

2. **`site/src/styles/global.css`**
   - 三色阶文字、浅灰代码块背景 `#f7f7f7`、**8px** 圆角代码区、链接用 **`#5e6ad2`** 作点缀（与文档中的品牌色一致）。
   - 三栏网格；约 **1180px** 以下隐藏右侧 TOC；**900px** 以下侧栏改为顶置堆叠。

3. **`site/src/pages/docs/[...slug].astro`**
   - 使用 `render(doc)` 的 **`headings`** 传给 Shell，生成右侧锚点目录。

4. **资源**
   - `cp reference/siyuan.png → site/public/siyuan.png`（构建与线上路径为 `/siyuan.png`，会随 `base` 前缀正确解析）。

本地预览：`cd site && pnpm dev`。若更新 LOGO，只需覆盖 `reference/siyuan.png` 后再执行一次复制（或日后用脚本同步）。

如需再贴近截图里的 **深色顶栏 / 真实搜索**，可以再说一下偏好（保持浅色文档区 vs 全站深色）。

---

**User**

加上搜索功能会很复杂吗？

---

**Cursor**

不一定会很复杂，取决于你要 **「搜什么」** 和 **「准不准 / 要不要服务端」**。

## 相对简单（静态站 + GitHub Pages 很合适）

**[Pagefind](https://pagefind.app/)**（或同类「构建后索引」工具）  
- **做法**：`pnpm build` 生成 `dist` 之后跑一条 Pagefind 命令，给 HTML 建索引；页面上放一个它自带或自绘的搜索框，**纯静态**，不需要数据库。  
- **复杂度**：偏低，常见是加 npm 脚本、一个搜索页或弹层、CI 里多一步。  
- **代价**：首次接入要调样式和中文分词预期（Pagefind 偏 **前缀 / 整词** 匹配，不是 Elasticsearch 那种中文分词）。

**自建「JSON 索引 + 前端 Fuse.js」**  
- **做法**：构建时用 Astro 脚本把所有 Markdown 标题/摘要抽成 `search.json`，客户端用 [Fuse.js](https://fusejs.io/) 模糊搜。  
- **复杂度**：中等（要自己写索引生成、结果列表 UI、可能还要处理 `base` 路径）。

## 中等偏高（体验好、维护多）

**Algolia DocSearch、Orama Cloud、Meilisearch 托管** 等  
- 自动爬站或推送索引，**相关性好**、可拼音/容错。  
- **复杂度**：集成 SDK、申请 key、CI 或 webhook；有的免费档有限制。

## 明显更复杂

- **服务端全文检索**（MiniSearch + API、Elasticsearch 等）：要单独部署服务，对「只挂 GitHub Pages」不友好。  
- **和思源内核联动**：若在编辑器里搜笔记再映射到文档站，那是产品级集成，和静态文档站搜索不是一类问题。

---

**结论**：在你现在这种 **Astro 静态 + Pages** 上，加「能用的文档搜索」**不必很复杂**；想少写代码就优先看 **Pagefind**；想完全掌控样式与行为就用 **构建时生成 JSON + Fuse.js**。如果你确定用其中一种，我可以按你当前 `site/` 结构直接改一版最小可用实现。

---

**User**

这个是要部署在 GitHub page 的，主流做法是什么？

---

**Cursor**

放在 **GitHub Pages**（纯静态、没有你自己的后端）上，**主流做法**大致是这几类：

## 1. **Pagefind**（近年静态文档里很常见）

- **流程**：先 `astro build` 出 HTML，再对 `dist` 跑 `pagefind --site dist`，生成轻量索引和一段可嵌入的搜索 UI。  
- **特点**：不依赖外部账号、**完全静态**、和 Pages 绝配；适合自建文档站。  
- **代价**：相关性不如商业搜索，中文体验要实际试一下是否够用。

## 2. **Algolia DocSearch**（很多开源项目文档在用）

- **流程**：向 DocSearch 计划提交站点，或自建爬虫 + Algolia 索引；前端用官方 DocSearch JS。  
- **特点**：**效果好**、有维护；开源文档常能免费用官方托管方案。  
- **代价**：要申请/配置、样式要嵌进你现在的 Linear 风壳里。

## 3. **自建「构建时索引 + 前端搜」**（Fuse.js / MiniSearch 等）

- **流程**：构建脚本生成 `search.json`（标题、片段、URL），部署后由浏览器加载 JSON 再搜索。  
- **特点**：无第三方、行为完全可控。  
- **代价**：要自己写索引生成和 UI，站点很大时要考虑 JSON 体积和首屏加载。

---

**一句话**：在 **GitHub Pages + 文档站** 场景里，**最省事的主流静态方案是 Pagefind**；**最省事的主流「好搜」方案是 DocSearch（Algolia）**；想完全自控就用 **构建时 JSON + Fuse/MiniSearch**。

你当前是 Astro 静态站，CI 里已经是「build → 上传 `dist`」的话，**在 `pnpm build` 后面加一步 Pagefind** 就是最常见的一条演进路径。

---

**User**

方案1和3我不太明白差异，具体展开说明一下

---

**Cursor**

下面把 **方案 1（Pagefind）** 和 **方案 3（自建 JSON + 前端搜）** 说清楚：它们解决的是同一件事（在静态站上搜文档），但 **索引从哪来、搜的是什么、谁控制逻辑** 不一样。

---

## 方案 1：Pagefind ——「对已经生成的网页做全文索引」

**在干什么**  
构建结束后，你得到一堆 **HTML 页面**（Astro `dist/`）。Pagefind 再跑一遍，去读这些 HTML 里的正文，自动建索引（含分词/压缩等它自己的一套），并生成一小套 **静态资源**（索引文件 + 默认搜索 UI 脚本）。

**搜的是什么**  
本质是：**最终页面上出现的文字**（和标题、meta 等它从 DOM 里抽到的内容）。  
Markdown 里有什么、最后渲染成什么样，就按 **HTML 结果** 来索引。

**特点**  
- **你不用写「抽标题、抽段落」的脚本**，少维护一块逻辑。  
- 和 **GitHub Pages** 很贴：多出来的只是 `dist` 里多几个文件，没有后端。  
- **黑盒**：搜什么、怎么分词、权重怎么算，都听 Pagefind；你要大改行为（例如只搜标题、按章节加权）会受限。  
- 站点很大时，索引体积和首次加载由 Pagefind 自己管，一般还能接受。

**一句话**：先有站，再「扫一遍站」生成搜索，**索引 = 对 HTML 的二次加工**。

---

## 方案 3：自建 JSON + Fuse.js 等 ——「构建时自己造一本「目录册」，浏览器里翻这本册子搜」

**在干什么**  
在 `astro build` 过程中（或单独一个 Node 脚本），你自己从 **Markdown / frontmatter / 内容集合** 里读出：标题、slug、可选摘要、甚至各级标题列表，写进一个（或几个）**`search.json`**。部署后，用户打开站点时浏览器下载这份 JSON，用 **Fuse.js / MiniSearch** 等在内存里做模糊匹配。

**搜的是什么**  
**你写进 JSON 里的字段**。  
例如只放「标题 + 第一段摘要」，那正文很长也搜不到；你把全文塞进去，JSON 会变大。  
也可以只索引「章节标题」做轻量导航式搜索——**完全由你定义**。

**特点**  
- **白盒**：搜哪些字段、权重、是否只搜中文、结果怎么排序，都你写。  
- 和 **Lute 以后接进来** 的关系：你可以在构建时用 Lute 把 MD 转成纯文本/HTML 片段，再写进 JSON，和「最终 HTML 是否一致」可以分开设计。  
- **你要维护索引生成代码**：内容结构一变，脚本可能要跟著改。

**一句话**：在构建时 **自己定义「可被搜索的文档长什么样」**，**索引 = 你生成的数据文件**。

---

## 对照表（抓差异）

| 维度 | 方案 1 Pagefind | 方案 3 JSON + Fuse 等 |
|------|-----------------|------------------------|
| 索引来源 | 构建好的 **HTML** | 你脚本从 **MD/数据层** 抽的字段 |
| 谁写「把文档变成可搜数据」 | Pagefind 自动 | 你自己写 |
| 和「最终页面是否一致」 | 天然一致（搜的就是页面） | 取决于你是否用同一套渲染/同一套文本 |
| 定制搜索行为 | 相对固定 | 很灵活 |
| 工程量 | 低（接 CI + 调 UI） | 中（索引脚本 + 结果 UI + 性能取舍） |
| 典型风险 | 中文/分词体验未必完美 | JSON 太大、首屏多一次下载 |

---

## 怎么选（实用结论）

- 想 **尽快在 GitHub Pages 上有搜索**，又不打算为搜索维护一套数据管线 → **Pagefind**。  
- 已经确定 **搜索范围要很窄**（只搜标题）、或 **要和 Lute/自定义字段强绑定**、或 **不想依赖「扫 HTML」** → **方案 3** 更合适。

两者也可以 **理论上并存**（一般没必要），通常二选一即可。若你告诉我更在意「少写代码」还是「和 Lute 同语义」，可以再缩到一个具体推荐。

---

**User**

用 Pagefind 试试效果

---

**Cursor**

正在将 Pagefind 接入 Astro 站点：安装依赖、在构建后运行索引，并把搜索 UI 嵌入侧栏。



正在为 `Shell.astro` 集成 Pagefind：在 `main` / `home-wrap` 上添加 `data-pagefind-body`，并更新构建脚本与样式。



已接入 **Pagefind**，主要改动如下。

## 行为说明

1. **`pnpm build`**：`astro build` 结束后自动执行  
   `pagefind --site dist --force-language zh`，在 **`dist/pagefind/`** 生成索引与 `pagefind-ui.js` / `pagefind-ui.css`。  
   GitHub Actions 里本来就是 `pnpm build`，**无需再改 Workflow**。

2. **索引范围**：在 **`main.doc-main`**（文档页）和 **`div.home-wrap`**（首页）上加了 **`data-pagefind-body`**，只索引正文；侧栏、TOC、顶栏操作区加了 **`data-pagefind-ignore`**，减少无关片段。

3. **搜索 UI**：文档页在**左侧栏**原搜索框位置挂载 Pagefind；首页在**顶栏**品牌与导航之间增加一条紧凑搜索。  
   **`import.meta.env.PROD` 为真**时才加载 Pagefind（`astro preview` 与线上）；**`pnpm dev`** 下没有索引，会显示一句提示，避免 404。

4. **样式**：在 `:root` 里覆写 Pagefind 的 **`--pagefind-ui-*`** 变量，与当前浅色 Linear 文档风一致。

5. **依赖**：`pagefind` 已写入 **`devDependencies`**（`package.json`）。

## 你怎么试

```bash
cd site
pnpm build
pnpm preview
```

在预览里搜例如「Lute」「部署」等即可。CLI 会提示：**中文没有词干还原**，只能按字面匹配，属 Pagefind 限制。

## 参考

- 默认 UI 用法见 [Pagefind UI usage](https://pagefind.app/docs/ui-usage/)。  
- 1.5.0 起官方更推荐 **Component UI**（新集成可考虑迁移）；当前为省事仍用 **Default UI（`PagefindUI`）**，构建时会有提示，不影响使用。

---

**User**

linear 不是直接放一个输入框的，是有个搜索图标放在左上角，点击之后在页面中上部弹出模态的搜索框，搜索之后列出结果

---

**Cursor**

查看 Pagefind 1.5 的 Component UI（模态 / 命令面板）集成方式。



正在将 Default UI 换为 Pagefind **Component UI** 的模态搜索：在 `<body>` 开头加入 `<pagefind-config>`，侧栏与顶栏仅保留 `compact` 的 `<pagefind-modal-trigger>`，并在页面底部放置 `<pagefind-modal>`。



已改成和 Linear 文档站类似的交互：**只有放大镜触发器**，点开后在**页面上方出现 Pagefind 的模态搜索**，结果在模态里列出；并保留 **⌘K / Ctrl+K**（`shortcut="mod+k"`）。

## 实现要点

1. **从 Default UI 换成 Pagefind 1.5 的 [Component UI](https://pagefind.app/docs/search-ui/)**  
   - 样式：`pagefind-component-ui.css`  
   - 脚本：`pagefind-component-ui.js`（`type="module"`）

2. **结构**（与[官方 Quick Start](https://pagefind.app/docs/search-ui/)一致）  
   - `<pagefind-config bundle-path="…" lang="zh">` 放在 `<body>` 最前（满足先于实例初始化）  
   - 文档页：侧栏 **`rail-top`** 里，品牌左侧、右侧 **`pagefind-modal-trigger`**（`compact` = 仅图标）  
   - 首页：顶栏品牌与导航之间的 **`topbar__search-slot`** 里同样一个 `compact` trigger  
   - 页面末尾一个 **`<pagefind-modal reset-on-close>`**，负责居中模态与结果列表  

3. **已去掉**侧栏里常驻的「假输入框」和旧的 `PagefindUI` / `data-pagefind-mount`。

4. **主题**：在 `:root` 里用 Pagefind Component 的 **`--pf-*`** 变量做了浅色对齐，并略加大模态阴影。

本地请仍用 **`pnpm build && pnpm preview`** 试搜索（`pnpm dev` 无索引，行为不变）。

若部署在 **带 base 的子路径** 上，`bundle-path` 会随 `import.meta.env.BASE_URL` 变成 `/仓库名/pagefind/`，与当前 `astro.config` 一致。若线上结果链接有偏差，再在 `pagefind-config` 上加 `base-url` 即可微调。

---

**User**

搜索图标要鼠标悬浮的时候才显示快捷键，正常情况下就是用一个圆形包裹

---

**Cursor**

查看 Pagefind 触发器如何渲染快捷键，以及能否用 CSS 实现“默认隐藏、悬停显示”。



将触发器设为固定正圆、仅显示放大镜；快捷键放在按钮下方的悬浮层（`position: absolute`），仅在 `:hover` 与 `:focus-visible` 时显示。



已按你的要求改好了，主要三点：

## 1. 常态：只有「圆 + 放大镜」

在 `global.css` 里对 `pagefind-modal-trigger.pf-trigger-wrap` 做了覆盖：

- `.pf-trigger-btn`：**32×32px、正圆**（`border-radius: 9999px`）、`padding: 0`、内容居中，看起来就是一个小圆按钮里只有搜索图标。  
- `.pf-trigger-text`：**视觉隐藏**（保留在 DOM 里，避免破坏 Pagefind 结构），并去掉占位文案：`placeholder=""`。  
- 给触发器加了 **`title="打开文档搜索（⌘K / Ctrl+K）"`**，鼠标悬停浏览器原生提示里也能看到快捷键说明。

## 2. 快捷键：只在悬停 / 键盘聚焦时出现

- `.pf-trigger-shortcut` 做成**绝对定位**，在按钮**正下方**（`top: calc(100% + 8px)`），默认 **`opacity: 0` + `visibility: hidden`**。  
- 仅在 **`.pf-trigger-btn:hover`** 与 **`:focus-visible`**（Tab 到按钮）时显示，并加一点位移过渡，接近 Linear 那种「浮一层提示」的感觉。  
- 浮层加了白底、细边框和阴影，避免和侧栏糊在一起。

## 3. 避免被裁切

为 **`left-rail`、`.doc-app`、`.rail-top__actions`、`.topbar__search-slot`** 加了 **`overflow: visible`**（及适当 `z-index`），让快捷键气泡能画出侧栏格子。

---

请再跑 **`pnpm build && pnpm preview`** 看实际交互；若你希望「纯触摸设备上也常驻显示快捷键」，可以再加一段 `@media (hover: none)` 的样式，我可以帮你补。

