# 思源开发者文档

本分支（默认 `main`）只存放开发者文档的 Markdown，供阅读、贡献，以及用 AI 开发集市包时直接引用。

网站源码在 [`site` 分支](https://github.com/TCOTC/siyuan-docs/tree/site)。旧 Astro 实现在 [`archive/astro-site`](https://github.com/TCOTC/siyuan-docs/tree/archive/astro-site)。

## 文件名

语言写在文件名后缀里，目录按主题分，不按网页 URL 分：

- `index.en.md` → `/en/`
- `index.zh-CN.md` → `/zh-CN/`
- `bazaar/overview.en.md` → `/en/bazaar/overview`
- `bazaar/overview.zh-CN.md` → `/zh-CN/bazaar/overview`

目前 locale 只有 `en` 与 `zh-CN`。同一篇可以只有一种语言。

## Frontmatter

每篇开头使用 YAML：

```yaml
---
title: 页面标题
description: 可选摘要
---
```

侧栏顺序与分组标题写在仓库根目录的 [`nav.yml`](nav.yml)。根级文档写成 `- index`；分组写成：

```yaml
- plugin:
  en: Plugins
  zh-CN: 插件
  pages:
    - overview
    - quickstart
```

不使用 frontmatter `order`。未列入 `nav.yml` 的页面仍可打开，只是不出现在侧栏。

## 相对链接

正文里的站内链接**不要**写语言后缀。构建时会用当前文件的语言补全：

```markdown
[集市包总览](../bazaar/overview)
```

可带或不带 `.md`。不要写成 `overview.zh-CN.md`。
