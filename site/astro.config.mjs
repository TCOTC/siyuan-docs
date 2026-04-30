// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** GitHub Pages 项目站时可在 CI 设置 `ASTRO_BASE_PATH=/仓库名`（无前导或带 / 均可） */
let base = '/';
const envBase = process.env.ASTRO_BASE_PATH?.trim();
if (envBase) {
	const withSlash = envBase.startsWith('/') ? envBase : `/${envBase}`;
	base = withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
}

/**
 * 开发模式下从最近一次 `pnpm build` 产出的 `dist/pagefind` 提供 Pagefind 静态资源，
 * 使 `pnpm dev` 能加载 Component UI（搜索按钮与模态层）。索引需先通过 build 生成。
 */
function pagefindDevAssets() {
	const baseTrim = base === '/' ? '' : base.replace(/\/$/, '');
	const pagefindPrefix = `${baseTrim}/pagefind`;

	/** @param {string} filePath */
	function mimeFor(filePath) {
		if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
		if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
		if (filePath.endsWith('.json')) return 'application/json; charset=utf-8';
		if (filePath.endsWith('.wasm')) return 'application/wasm';
		return 'application/octet-stream';
	}

	return {
		name: 'pagefind-dev-assets',
		/** @param {any} server */
		configureServer(server) {
			const root = path.join(__dirname, 'dist', 'pagefind');
			if (!fs.existsSync(root)) {
				console.warn('[pagefind-dev] 未找到 dist/pagefind：请先执行 pnpm build，再在 dev 中使用站内搜索。');
			}
			server.middlewares.use(
				(
					/** @type {import('node:http').IncomingMessage} */ req,
					/** @type {import('node:http').ServerResponse} */ res,
					/** @type {(err?: unknown) => void} */ next,
				) => {
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
	output: 'static',
	base,
	vite: {
		plugins: [pagefindDevAssets()],
	},
	markdown: {
		shikiConfig: {
			// 双主题 + defaultColor: false → 仅输出 --shiki-light* / --shiki-dark*，由 global.css 按 data-theme 选用，避免与内联 color 冲突导致无高亮
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			defaultColor: false,
		},
	},
});
