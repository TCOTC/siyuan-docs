# Vite / 构建插件说明

## 主栈与「站点 IIFE」补充栈

- **主栈**：Astro + Vite（Rollup）负责整站、样式与 `import …?url` 的脚本产物（开发期为 ESM）。
- **补充栈**：[`bundle-site-browser-iife.ts`](./bundle-site-browser-iife.ts) 封装 **唯一** 的 esbuild 调用，只在下面两种场景出现，**不是**第二套「应用级」打包器：
  1. **`?inline-bundle`** — [`inline-bundle-script.ts`](./inline-bundle-script.ts) 在 Vite 解析阶段把入口打成 IIFE 字符串，供 `<script is:inline>`（见 `Shell.astro`）。
  2. **构建收尾** — [`rewrite-url-script-outputs-to-iife.ts`](./rewrite-url-script-outputs-to-iife.ts) 在 `astro:build:done` 用**相同** esbuild 选项覆盖部分 `_astro/*.js`，与生产环境 `import.meta.env.BASE_URL` 及 `ExternalScript.astro` 的 classic / module 约定对齐。

`import.meta.env.BASE_URL` 的注入与 Astro 的 `base` 同源，见 [`lib/publishedSiteBaseUrl.ts`](./lib/publishedSiteBaseUrl.ts)。

## 修改脚本打包行为时

先改 `bundle-site-browser-iife.ts`（目标、压缩、`define` 等），再视需要调整 `rewrite-url-script-outputs-to-iife.ts` 中的入口表或 `Shell.astro` 中的 `?inline-bundle` / `?url` 引用。
