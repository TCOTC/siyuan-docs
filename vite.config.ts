import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import 'vite-ssg';
import { docSsgRoute } from './src/lib/docPath.ts';

const siteBase = process.env.SITE_BASE || '/';
const docsJsonPath = path.join(process.cwd(), 'tmp', 'docs.json');

function includedDocRoutes(): string[] {
	// `/` 是客户端 redirect，不预渲染，避免与默认语言首页重复
	if (!fs.existsSync(docsJsonPath)) return ['/404'];
	const data = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8')) as {
		docs: { locale: string; stem: string }[];
	};
	const routes = ['/404'];
	for (const doc of data.docs) {
		routes.push(docSsgRoute(doc.locale, doc.stem));
	}
	return routes;
}

/** 开发时把上次构建的 `dist/pagefind` 挂到 `/pagefind/`，避免 SPA 回退成 HTML 导致搜索脚本假加载 */
function pagefindDevPlugin(): Plugin {
	const pagefindDir = path.join(process.cwd(), 'dist', 'pagefind');
	const mimeByExt: Record<string, string> = {
		'.js': 'text/javascript; charset=utf-8',
		'.css': 'text/css; charset=utf-8',
		'.json': 'application/json; charset=utf-8',
		'.wasm': 'application/wasm',
	};
	return {
		name: 'pagefind-dev',
		configureServer(server) {
			server.middlewares.use((req, res, next) => {
				const raw = req.url?.split('?')[0] ?? '';
				const marker = '/pagefind/';
				const idx = raw.indexOf(marker);
				if (idx < 0) {
					next();
					return;
				}
				const rel = decodeURIComponent(raw.slice(idx + marker.length));
				if (!rel || rel.includes('\\') || rel.split('/').includes('..')) {
					next();
					return;
				}
				const root = path.resolve(pagefindDir);
				const file = path.resolve(root, rel);
				if (file !== root && !file.startsWith(`${root}${path.sep}`)) {
					next();
					return;
				}
				if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
					next();
					return;
				}
				res.setHeader('Content-Type', mimeByExt[path.extname(file)] ?? 'application/octet-stream');
				fs.createReadStream(file).on('error', () => next()).pipe(res);
			});
		},
	};
}

export default defineConfig({
	base: siteBase.endsWith('/') ? siteBase : `${siteBase}/`,
	resolve: {
		alias: {
			'#docs': docsJsonPath,
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith('pagefind-'),
				},
			},
		}),
		pagefindDevPlugin(),
	],
	ssgOptions: {
		script: 'async',
		dirStyle: 'nested',
		includedRoutes() {
			return includedDocRoutes();
		},
	},
});
