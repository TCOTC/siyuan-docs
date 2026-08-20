---
title: 快速上手
description: 从模板仓库到本地启用插件
---

本章给出一条可重复执行的「最短路径」，细节与字段说明分散在 [plugin.json](./manifest)、[前端 API](./frontend-api) 等章节。

---

## 1. 准备仓库

1. 打开 [plugin-sample](https://github.com/siyuan-note/plugin-sample)。
2. 使用 **Use this template** 生成你的仓库。
3. **仓库名必须等于插件包名**（与 `plugin.json` 的 `name` 一致），默认分支 **`main`**。

---

## 2. 放置目录（推荐）

将仓库克隆到：

**`{思源工作空间}/data/plugins/<插件名>/`**

这样每次 `pnpm run build` 生成的 **`index.js`** 可被思源直接加载，无需手动拷贝。

---

## 3. 安装依赖与开发构建

```bash
cd <插件仓库>
pnpm i
pnpm run dev
```

- **`dev`**：监听文件变化并持续编译出 **`index.js`** / **`index.css`**。
- 保持思源客户端开启，在 **集市 → 下载** 或插件管理中启用你的插件（具体入口随版本 UI 可能微调）。

---

## 4. 目录结构（示例）

```text
my-plugin/
├── package.json
├── plugin.json
├── tsconfig.json
├── webpack.config.js         # 或项目所用打包配置
├── src/
│   └── index.ts              # export default class extends Plugin
├── i18n/
│   ├── zh_CN.json
│   └── en_US.json
├── icon.png                  # 集市展示
├── preview.png
├── README.md
└── README_zh_CN.md
```

构建产物 **`index.js`、`index.css`** 出现在仓库根目录（取决于 webpack 配置）。

---

## 5. 修改入口类

编辑 **`src/index.ts`**，在 **`onload`** 里写最小逻辑：

```ts
import { Plugin, showMessage } from "siyuan";

export default class MyPlugin extends Plugin {
	async onload() {
		showMessage(this.i18n?.hello ?? "MyPlugin loaded");
	}
}
```

对应在 **`i18n/zh_CN.json`** 增加 **`hello`** 字段测试国际化链路。

---

## 6. 生产构建

```bash
pnpm run build
```

生成 **`package.zip`**（文件名以示例仓库为准），用于 [打包与发布](./packaging)。

---

## 7. 常见问题

| 现象 | 排查 |
| --- | --- |
| 插件未加载 | 控制台是否有 `plugin xxx run error`；`index.js` 是否存在 |
| 启用后立即消失 | `minAppVersion` 过高或 **backend/frontend** 不匹配 |
| 改代码不生效 | 是否重新编译；是否禁用再启用插件 |

更多排错步骤见 [调试与排错](./debugging)。
