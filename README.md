# 思源开发者文档站

本分支是文档网站源码（Vue 3 + Vite）。Markdown 正文在 [`main`](https://github.com/TCOTC/siyuan-docs/tree/main) 分支。

```bash
pnpm install
pnpm dev
```

`pnpm dev` 必须停在 `site` 分支。不要在同一工作目录里切到 `main`：Git 会卸掉站点源码，还在跑的 Vite 会立刻找不到文件，`node_modules/` 等残留也会留在 `main` 工作区里。改文档请另开 `git worktree`，或先停掉 `dev` 再切分支。

启动时会从 `origin/main` 抽文档并跑 Lute（只 fetch，不切换当前分支），然后起 Vite。Vue / SCSS 会热更新。改 Markdown 后另开终端跑 `pnpm prepare-docs`（或重启 `dev`）；`docs.json` 更新后 Vite 一般会跟着热更新。本地不要设置 `SITE_BASE`（默认 `/`）。开发服没有 Pagefind 索引，搜索请用 `pnpm build` 再 `pnpm preview`。

```bash
pnpm build
pnpm preview
```

`pnpm build` 会从 `origin/main` 拉取文档，用 Lute 转成 HTML，再静态导出。GitHub Pages 项目站需设置 `SITE_BASE=/siyuan-docs`。
