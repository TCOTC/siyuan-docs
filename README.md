# 思源开发者文档站

本分支是文档网站源码（Vue 3 + Vite）。Markdown 正文在 [`main`](https://github.com/TCOTC/siyuan-docs/tree/main) 分支。

```bash
pnpm install
pnpm build
pnpm preview
```

`pnpm build` 会从 `origin/main` 拉取文档，用 Lute 转成 HTML，再静态导出。GitHub Pages 项目站需设置 `SITE_BASE=/siyuan-docs`。
