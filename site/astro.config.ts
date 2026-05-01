import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { fileURLToPath } from 'node:url';
import rehypeDeveloperInternalLinks from './src/markdown/rehype-developer-internal-links.ts';
import rehypeStripInterElementWhitespace from './src/markdown/rehype-strip-inter-element-whitespace.ts';
import { inlineBundleScript } from './vite-plugins/inline-bundle-script.ts';
import { rewriteBundledScripts } from './vite-plugins/post-bundle-script-entries.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readPagefindLibVersion(): string {
	const pkgPath = path.join(__dirname, 'node_modules', 'pagefind', 'package.json');
	if (!fs.existsSync(pkgPath)) {
		throw new Error(`[site] 未找到 pagefind：${pkgPath}（请先 pnpm install）`);
	}
	const { version } = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as { version: string };
	return version;
}

const PAGE_FIND_LIB_VERSION = readPagefindLibVersion();

/** GitHub Pages 项目站时可在 CI 设置 `ASTRO_BASE_PATH=/仓库名`（无前导或带 / 均可） */
let base = '/';
const envBase = process.env.ASTRO_BASE_PATH?.trim();
if (envBase) {
	const withSlash = envBase.startsWith('/') ? envBase : `/${envBase}`;
	base = withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
}

/**
 * 开发模式下从最近一次 `pnpm build` 产出的 `dist/pagefind/<版本>/` 提供 Pagefind 静态资源，
 * 使 `pnpm dev` 能加载 Component UI（搜索按钮与模态层）。索引需先通过 build 生成。
 */
function pagefindDevAssets() {
	const baseTrim = base === '/' ? '' : base.replace(/\/$/, '');
	const pagefindPrefix = `${baseTrim}/pagefind/${PAGE_FIND_LIB_VERSION}`;

	function mimeFor(filePath: string): string {
		if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
		if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
		if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
		if (filePath.endsWith('.wasm')) return 'application/wasm';
		return 'application/octet-stream';
	}

	return {
		name: 'pagefind-dev-assets',
		configureServer(server: any) {
			const root = path.join(__dirname, 'dist', 'pagefind', PAGE_FIND_LIB_VERSION);
			server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: (err?: unknown) => void) => {
				if (req.method !== 'GET' && req.method !== 'HEAD') return next();
				const raw = (req.url ?? '').split('?')[0];
				if (!raw.startsWith(pagefindPrefix)) return next();
				const tail = decodeURIComponent(raw.slice(pagefindPrefix.length).replace(/^\/+/, ''));
				if (!tail || tail.includes('..')) return next();
				const filePath = path.join(root, tail);
				if (!filePath.startsWith(root)) return next();
				fs.stat(filePath, (err, st) => {
					if (err || !st.isFile()) return next();
					res.setHeader('Content-Type', mimeFor(filePath));
					res.setHeader('Cache-Control', 'no-store');
					if (req.method === 'HEAD') {
						res.statusCode = 200;
						res.end();
						return;
					}
					const stream = fs.createReadStream(filePath);
					stream.on('error', () => next());
					stream.pipe(res);
				});
			});
		},
	};
}

// https://astro.build/config
export default defineConfig({
	/**
	 * `ignore`：预览与各类静态托管对「是否带尾斜杠」不一致时，不因尾斜杠单独 404；
	 * 正文内链已由 rehype 写成根相对绝对路径，不依赖当前目录解析。
	 */
	trailingSlash: 'ignore',
	integrations: [
		{
			name: 'post-bundle-script-entries',
			hooks: {
				'astro:build:done': async ({ dir }) => {
					const distPath =
						typeof dir === 'string' ? dir : fileURLToPath(dir);
					const siteRoot = path.dirname(distPath);
					await rewriteBundledScripts(siteRoot);
				},
			},
		},
	],
	output: 'static',
	/** 生产构建压缩 HTML；theme-boot / pagefind-loader / shell 等为 TS 源码，产物为压缩后的 `.js` */
	compressHTML: true,
	base,
	i18n: {
		defaultLocale: 'zh',
		locales: ['zh', 'en'],
		routing: {
			prefixDefaultLocale: true,
		},
	},
	vite: {
		define: {
			__PAGEFIND_LIB_VERSION__: JSON.stringify(PAGE_FIND_LIB_VERSION),
		},
		esbuild: {
			/** 去掉注释，便于主题 boot / 外链脚本产物接近单行 */
			legalComments: 'none',
		},
		/** 小体积 `?url` 资源默认会内联为 `data:`，无法走 esbuild 压缩；关闭内联以输出独立 .js 并参与压缩 */
		build: {
			assetsInlineLimit: 0,
			/** 对齐 Baseline Widely Available，减小转换体积 */
			target: 'es2022',
			minify: 'esbuild',
			cssMinify: true,
			rollupOptions: {
				output: {
					chunkFileNames: '_astro/[name].[hash].js',
					entryFileNames: '_astro/[name].[hash].js',
					/** `import '*.ts?url'` 默认可能落成 `*.ts`，静态托管 MIME 不对；强制改为 `.js` */
					assetFileNames: (info: { names?: string[] }) => {
						const names = info.names ?? [];
						if (names.some((n) => n.endsWith('.ts') || n.endsWith('.tsx'))) {
							return '_astro/[name].[hash].js';
						}
						return '_astro/[name].[hash][extname]';
					},
				},
			},
		},
		plugins: [inlineBundleScript(__dirname), pagefindDevAssets()],
	},
	markdown: {
		rehypePlugins: [rehypeStripInterElementWhitespace, [rehypeDeveloperInternalLinks, base]],
		shikiConfig: {
			// 双主题 + defaultColor: false → 仅输出 --shiki-light* / --shiki-dark*，由 global.scss 按 data-theme 选用，避免与内联 color 冲突导致无高亮
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
