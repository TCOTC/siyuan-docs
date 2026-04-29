# 思源开发文档 · 站点预览（Astro）

## 本地预览

```bash
pnpm install
pnpm dev
```

浏览器打开终端里提示的地址（一般为 `http://localhost:4321`）。

**说明**：`pnpm dev` 时不会生成 Pagefind 索引，侧栏 / 顶栏会显示简短提示。要试用站内搜索，请使用下面「带搜索的预览」。

## 带搜索的预览（Pagefind）

```bash
pnpm build
pnpm preview
```

`pnpm build` 会在 `astro build` 之后自动执行 `pagefind`，在 `dist/pagefind/` 生成索引与 **Component UI**（模态搜索：`pagefind-modal-trigger` + `pagefind-modal`）。`pnpm preview` 打开生产构建后，点击侧栏或顶栏的**放大镜**、或按 **⌘K / Ctrl+K** 打开搜索层。

## 生产构建

```bash
pnpm build
```

输出目录：`dist/`。

若仓库使用 **GitHub Pages 项目站**（地址形如 `https://<用户>.github.io/<仓库名>/`），构建时需带 base，与根目录 Workflow 中一致：

```bash
ASTRO_BASE_PATH=/你的仓库名 pnpm build
```

本地开发不要设置该变量，保持根路径即可。

## Pages 设置

在 GitHub 仓库 **Settings → Pages** 中，将 **Build and deployment** 的 **Source** 选为 **GitHub Actions**，推送 `main` 且变更在 `site/` 下时会由 Workflow 构建并发布。
