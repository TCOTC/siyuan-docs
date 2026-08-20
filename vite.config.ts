import { defineConfig, type Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import 'vite-ssg';

const siteBase = process.env.SITE_BASE || '/';
const docsJsonPath = path.join(process.cwd(), 'tmp', 'docs.json');

function includedDocRoutes(): string[] {
	if (!fs.existsSync(docsJsonPath)) return ['/'];
	const data = JSON.parse(fs.readFileSync(docsJsonPath, 'utf8')) as {
		docs: { locale: string; stem: string }[];
		homeStem: string;
	};
	const routes = ['/', '/404'];
	for (const doc of data.docs) {
		if (doc.stem === data.homeStem) routes.push(`/${doc.locale}`);
		else routes.push(`/${doc.locale}/${doc.stem}`);
	}
	return routes;
}

const markdownPlainText = 'text/plain; charset=utf-8';

function isMarkdownRequest(url: string | undefined): boolean {
	if (!url) return false;
	const pathname = url.split('?')[0] ?? '';
	return pathname.endsWith('.md');
}

/** 把文档 `.md` 的 Content-Type 改成纯文本，避免浏览器按 `text/markdown` 下载 */
function markdownPlainTextPlugin(): Plugin {
	function forcePlainText(
		req: { url?: string },
		res: { setHeader: (name: string, value: number | string | readonly string[]) => unknown },
		next: () => void,
	): void {
		if (!isMarkdownRequest(req.url)) {
			next();
			return;
		}
		const setHeader = res.setHeader.bind(res);
		res.setHeader = (name, value) => {
			if (String(name).toLowerCase() === 'content-type') {
				return setHeader('Content-Type', markdownPlainText);
			}
			return setHeader(name, value);
		};
		next();
	}
	return {
		name: 'markdown-plain-text',
		configureServer(server) {
			server.middlewares.use(forcePlainText);
		},
		configurePreviewServer(server) {
			server.middlewares.use(forcePlainText);
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
		markdownPlainTextPlugin(),
	],
	ssgOptions: {
		script: 'async',
		dirStyle: 'nested',
		includedRoutes() {
			return includedDocRoutes();
		},
	},
});
