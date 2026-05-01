# 站点功能清单

便于逐项核对：若要删减某项，可直接在本文件中标注或告知维护者移除对应代码路径。

## 构建与产物

- **Astro 静态导出**：`output: 'static'`。
- **HTML 压缩**：`compressHTML: true`。
- **首屏主题脚本**：`src/scripts/theme-boot.js`（单行压缩）外链加载，避免原先 `<script is:inline>` 既不压缩又保留注释。
- **`html` 根节点**：仅保留 `lang`、404 页所需的 `data-doc-locale`；Pagefind bundle 改为 `<meta name="pagefind-bundle">`；代码块复制文案改为 `<script type="application/json" id="siyuan-code-copy-i18n">`，避免在 `<html>` 上堆叠多条 `data-*`。
- **Vite 构建**：`build.target: 'es2022'`、`minify: 'esbuild'`、`cssMinify: true`；`assetsInlineLimit: 0` 避免小资源被内联为 `data:`，便于缓存与压缩。
- **Pagefind**：`pnpm build` 后对 `dist` 建立搜索索引；产物在 `dist/pagefind/<已安装 pagefind 的 npm 版本>/`，与页面 `bundle-path` 对齐，升级依赖时整包 URL 前缀变化以免缓存混用。
- **配置入口**：`astro.config.ts`（由原先的 `astro.config.mjs` 迁移）。

## 样式（SCSS）

- **全局样式入口**：`src/styles/global.scss`，通过 `@use` 引入 `_tokens.scss`（设计令牌 / `:root`）与 `_document.scss`（版面与组件样式）。
- **Markdown 输出**：`rehype-strip-inter-element-whitespace` 去掉「元素—元素」之间仅含空白的文本节点，收紧正文标签间换行（见 `src/markdown/rehype-strip-inter-element-whitespace.ts`）。
- **明暗主题**：`html[data-theme='light'|'dark']`，首屏内联脚本写入，避免主题图标闪烁。
- **自定义滚动条**：细轨道、主题色滑块。
- **响应式文档布局**：宽屏固定侧栏、窄屏抽屉侧栏、多档断点（含约 450px / 850px 等）。
- **首页与 404 专用样式**：如 `.home-wrap`、`.not-found-doc` 等。

## 国际化（i18n）

- **Astro i18n**：默认语言 `zh`，前缀路由，`locales: zh, en`。
- **开发者文档路由**：`/zh/developers/...` 与 `/en/developers/...`。
- **根路径 `/`**：根据 `localStorage` / 浏览器语言重定向到中文或英文 welcome（`src/pages/index.astro` + `index-redirect.ts`）。
- **语言切换**：顶栏组件记录 `siyuan-docs-locale`，供首页与 404 判定使用。
- **404 页**：同页中英双份正文与双份侧栏目录；按 URL / 存储 / 浏览器语言切换 `data-doc-locale` 与中文补丁文案（`not-found-locale.ts`、`NotFoundLocaleHeadScript.astro`）。

## 布局与组件（Astro）

- **`Shell.astro`**：文档站外壳（顶栏 / 侧栏 / 面包屑 / TOC / Pagefind 宿主等）。
- **`DeveloperDocPage.astro`**：单篇开发者文档渲染。
- **`BrandLogo.astro`**：品牌 SVG（与 favicon 几何一致）。
- **`LangSwitcher.astro`**：语言下拉（无障碍 `menu`）。
- **`PagefindToolbarTrigger.astro`**：搜索触发占位（与 Pagefind UI 交接）。
- **`RailNavSections.astro`**：侧栏分组导航（404 双栏模式复用）。
- **`ThemeToggleHint.astro`**：主题切换按钮 + 浮动快捷键提示。
- **`CopyPageMarkdownToolbar.astro`**：复制 Markdown / 查看 `.md` 分组控件。

## 内容（Content Collections）

- **`docs` 集合**：自仓库根目录 `developers/` 加载 `**/*.md`，字段含 `title`、`description`、`order` 等（见 `src/content.config.ts`）。
- **导航**：`getDeveloperDocsNav.ts` 等按分组与 `order` 生成侧栏。

## Markdown 与代码展示

- **Shiki 双主题**：亮/暗对应 `github-light` / `github-dark`，`defaultColor: false`，由 CSS 变量驱动（避免与主题切换冲突）。
- **正文 `.prose`**：标题锚点、列表、引用、表格等层级样式。
- **代码块复制**：`shell-ui.ts` 为 `.prose pre` 注入右上角复制按钮；文案来自 `<script type="application/json" id="siyuan-code-copy-i18n">`（见 `Shell.astro`）。

## 客户端脚本（TypeScript → 打包）

- **`shell-ui.ts`**：主题切换与存储、`prefers-color-scheme` 监听、跨标签 `storage` 同步；文档工具条在顶栏/侧栏槽位间移动；复制整页 Markdown（支持 fetch 当前页 `.md`）；`T` 键切换主题；复制/语言菜单；侧栏抽屉开关与 `Escape`；侧栏滚动边缘虚化数据属性；侧栏分组折叠；**本页目录（TOC）滚动高亮与指示条**；代码块复制。
- **`doc-shell-bootstrap`（内联于 shell-ui 入口）**：首帧前同步 `--doc-overlay-top` / 主栏 inset / 固定 TOC 的 `left`（`syncDocOverlayLayoutMetrics`）、侧栏滚动边缘与 TOC；`Shell.astro` 内联脚本在 deferred 模块之前重复写入布局变量并处理 `location.hash`，减轻顶栏与面包屑首帧跳变（原独立 `doc-layout-bootstrap.js` 已合并）。
- **`doc-reading-sync.ts`**：`syncDocOverlayLayoutMetrics`、侧栏 `syncRailScrollEdges` 与 `tocSync` 算法，供 bootstrap、内联首屏与 `shell-ui` 共用。
- **`anchored-floating-hint.ts`**：浮动提示层 portal 到 `body`、`⌘/Ctrl` 标签、Pagefind 占位替换后重新绑定。
- **`pagefind-loader.js`（`public/`，保持传统脚本）**：空闲或快捷键/点击时加载 Pagefind Component UI，挂载 `pagefind-modal-trigger`，避免双按钮。
- **`not-found-locale.ts`**：404 语言检测与中英文 DOM 补丁。
- **`index-redirect.ts`**：首页语言重定向。

## 服务端 / 构建期 API

- **`.md` 端点**：`[...slug].md.ts` 暴露 stripped Markdown（复制与「查看原始 Markdown」链接，`developerMarkdownEndpoint.ts`、`developerDocStrippedMarkdown.ts`）。

## 搜索（Pagefind）

- **`pagefind-config`**：bundle 路径与 UI 语言。
- **`pagefind-modal`**：搜索模态层（自定义元素）。
- **`data-pagefind-body` / `data-pagefind-ignore`**：控制索引范围。
- **开发模式**：若存在 `dist/pagefind/<当前已安装的 pagefind 版本>/`，Vite 插件从该目录提供资源以便 dev 下调试搜索（需先 build 过一次）。

## 其他站点行为

- **跳过导航链接**：`.skip-link`。
- **`hreflang` / `alternate`**：开发者文档页 alternate 链接。
- **GitHub / 官网 / 集市外链**：侧栏底部与顶栏等。
- **Favicon**：`favicon.svg` / `favicon.ico`。

## 可访问性（摘录）

- 侧栏 `aria-expanded` / `aria-controls`、抽屉 `aria-modal`、面包屑与 TOC `aria-label`、菜单 `role="menu"` 等（详见各组件 markup）。

---

若删除某条功能，请同时检查：`Shell.astro`、`shell-ui.ts`、`src/styles/_document.scss`、`pagefind` 相关 public 脚本与构建脚本。
