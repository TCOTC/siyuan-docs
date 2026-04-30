# 开发者文档网站风格参考清单

用途：做思源（或其它）开发者文档时，可逐个打开感受 **信息架构、视觉、导航、API 与叙事比例**。链接均为公开站点；若个别改版，以官网为准。

---

## 一、商业产品 / API 文档（强品牌、高完成度）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| Stripe Docs | https://stripe.com/docs | 左侧深目录 + 中间正文 + 右侧「本页内」锚点；API 与概念文穿插；交互示例多。 |
| Twilio Docs | https://www.twilio.com/docs | 多产品分域、任务导向路径清晰；SDK 语言切换常见范式。 |
| Plaid Docs | https://plaid.com/docs | 金融科技类：流程图 + 沙箱说明 + 错误码并重。 |
| SendGrid / Twilio Email API | https://docs.sendgrid.com | 邮件类 API：表格参数 + 示例请求体为主。 |
| Mapbox | https://docs.mapbox.com | 地图 / GL：大量可运行 demo、版本与 token 说明前置。 |
| Cloudflare Docs | https://developers.cloudflare.com | 产品线极多；统一壳 + 子域分册；搜索与「从入门到参考」分层。 |
| Vercel Docs | https://vercel.com/docs | 极简留白、强产品绑定；短段落 + 截图 + 少量深度文。 |
| Linear API | https://developers.linear.app/docs | 偏「开发者门户」：GraphQL、简洁侧栏、暗色友好。 |
| Notion API | https://developers.notion.com/reference | 参考型页面多；OAuth 与对象模型说明独立成块。 |
| Slack API | https://api.slack.com | 经典「平台文档」：概念、事件、Block Kit 分大块。 |
| Discord Developer | https://discord.com/developers/docs | 游戏 / 社区向：交互组件与网关事件分册。 |

---

## 二、开源框架 / 语言官方文档（社区标杆）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| React（新文档） | https://react.dev | 叙事 + 图示 + 可编辑沙箱；Learn / Reference 二分。 |
| Vue（VitePress） | https://vuejs.org | VitePress 典型：指南 + API + 示例一体化。 |
| Svelte / SvelteKit | https://svelte.dev/docs / https://kit.svelte.dev/docs | 教程感强、单页滚动章节多。 |
| Astro Docs | https://docs.astro.build | 星标项目文档：插画 + 组件岛概念可视化。 |
| Vite | https://vite.dev | 配置项密集、表格多；插件生态单独成章。 |
| TypeScript Handbook | https://www.typescriptlang.org/docs/handbook/intro.html | 「手册」体：概念递进、少花哨组件。 |
| Rust Book | https://doc.rust-lang.org/book | 线性书籍式章节；适合长文深度阅读。 |
| Rust std / API | https://doc.rust-lang.org/std | rustdoc 经典：侧栏模块树 + 源码链接。 |
| Go 官方文档 | https://go.dev/doc / https://pkg.go.dev | 极简 HTML；包浏览器 pkg.go.dev 为另一套信息密度。 |
| Python 文档 | https://docs.python.org/3 | Sphinx 经典布局；教程 / 库参考 / 语言参考分立。 |
| MDN | https://developer.mozilla.org | 百科 + 参考：兼容性表格、横向标签（指南/示例/属性）。 |
| Kubernetes | https://kubernetes.io/docs/home | 巨型侧栏；任务 / 概念 / 参考分层（Diátaxis 影子）。 |
| Docker Docs | https://docs.docker.com | 产品矩阵大；Get started 流水线明显。 |
| Node.js | https://nodejs.org/docs/latest/api | 单页 API 索引 + 模块长页；偏「电话簿」密度。 |
| Deno | https://docs.deno.com | 现代壳 + runtime / deploy / subhosting 分产品线。 |
| Elixir | https://hexdocs.pm/elixir/Kernel.html | HexDocs：版本切换、源码链接、侧边模块树。 |
| Laravel | https://laravel.com/docs | 单框架「大部头」：按版本归档、 prose 多。 |

---

## 三、基础设施 / 云厂商（企业文档范式）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| AWS 文档 | https://docs.aws.amazon.com | 多服务独立站点；面包屑深；CLI / CloudFormation 平行入口。 |
| Google Cloud | https://cloud.google.com/docs | 与控制台交叉链接多；「快速开始」模板化。 |
| Azure / Microsoft Learn | https://learn.microsoft.com | Learn 统一模板：模块、沙箱、成就路径。 |
| Terraform Registry Docs | https://registry.terraform.io/providers/hashicorp/aws/latest/docs | 提供商文档自动生成感强；资源一页一资源。 |

---

## 四、数据层 / ORM / 后端（API + 数据建模叙事）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| Prisma Docs | https://www.prisma.io/docs | ORM：schema / migrate / client 三线；图多。 |
| Supabase Docs | https://supabase.com/docs | BaaS：Auth、Storage、Realtime 分册；与 Dashboard 对照写。 |
| Hasura Docs | https://hasura.io/docs/latest/index | GraphQL engine：权限与事件说明比重大。 |
| PostgreSQL | https://www.postgresql.org/docs/current | 传统手册：SQL 命令一字典式排版。 |

---

## 五、前端 UI / CSS（视觉演示与组件库）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| Tailwind CSS | https://tailwindcss.com/docs | 工具类即文档：搜索 + 表格 + 可复制 class。 |
| Radix UI | https://www.radix-ui.com/primitives/docs/overview/introduction | 无样式组件：可访问性说明 + API props 表。 |
| shadcn/ui | https://ui.shadcn.com/docs | 「复制粘贴组件」文档：与 CLI、主题变量强绑定。 |
| Material UI (MUI) | https://mui.com/material-ui/getting-started | 组件级 demo + props 表 + 设计令牌章节。 |

---

## 六、图形 / 游戏 / 创意编码（示例驱动）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| Three.js Manual / Docs | https://threejs.org/manual / https://threejs.org/docs | Manual 教程体 + Docs API 体双站点。 |
| p5.js Reference | https://p5js.org/reference | 每个函数小页 + 画布示例。 |
| Godot Engine Docs | https://docs.godotengine.org | Sphinx；2D/3D/脚本分树，社区翻译多语言。 |

---

## 七、工具链与「文档引擎」本身（做站时对标实现）

| 站点 | 链接 | 说明 |
|------|------|------|
| VitePress | https://vitepress.dev | VitePress 官方；默认主题即许多项目同款。 |
| Docusaurus | https://docusaurus.io/docs | Meta 出品；版本化、博客、i18n 开箱。 |
| Starlight (Astro) | https://starlight.astro.build | Astro 系文档主题；侧栏与 Expressive Code 等。 |
| Nextra | https://nextra.site/docs | Next.js + MDX；Notion 风可选。 |
| Mintlify（产品站） | https://mintlify.com/docs | 商业化文档托管；导航与「开发者门户」观感可参考（非必须自用）。 |
| Read the Docs 样例 | https://docs.readthedocs.io | Sphinx / MkDocs 托管平台的说明文档本身。 |
| MkDocs Material | https://squidfunk.github.io/mkdocs-material | Material 主题：搜索、标签、版本切换成熟。 |

---

## 八、笔记 / 知识库类产品文档（与「库 + 发布」接近）

| 站点 | 链接 | 风格要点 |
|------|------|----------|
| Obsidian Help | https://help.obsidian.md | 维基风格、短页多；与产品 UI 术语一致。 |
| Obsidian Developer Docs（Publish） | https://docs.obsidian.md | 插件 / 主题开发；库式结构 + 官方 Publish（非开源引擎）。 |

---

## 九、方法论（写结构而非只看皮肤）

| 资源 | 链接 | 说明 |
|------|------|----------|
| Diátaxis | https://diataxis.fr | 教程 / 指南 / 解释 / 参考 四分法；适合规划目录而非抄 UI。 |
| Write the Docs | https://www.writethedocs.org | 技术写作社区；指南与会议材料偏「怎么写」。 |

---

## 使用建议

1. **先定类型**：API 参考为主（Stripe）、叙事学习为主（React.dev）、还是混合型（Kubernetes）。
2. **记录观感**：每个站看 5 分钟，记下侧栏深度、搜索位置、移动端是否可用、代码块是否可复制。
3. **与思源场景对齐**：若文档面向插件开发者，可多对标「扩展点清晰 + 最小示例可跑」的站（VS Code 扩展文档、Obsidian 插件文档等）；需要的话可再单列一期「IDE / 编辑器扩展文档」专题。

---

*整理日期：2026-04-29；链接若失效请自行搜索站点名。*
