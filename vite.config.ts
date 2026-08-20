import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import fs from 'node:fs';
import path from 'node:path';
import 'vite-ssg';

const siteBase = process.env.SITE_BASE || '/';

function includedDocRoutes(): string[] {
	const jsonPath = path.join(process.cwd(), 'src/generated/docs.json');
	if (!fs.existsSync(jsonPath)) return ['/'];
	const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as {
		docs: { locale: string; stem: string }[];
	};
	const routes = ['/', '/404'];
	for (const doc of data.docs) {
		routes.push(`/${doc.locale}/${doc.stem}`);
	}
	return routes;
}

export default defineConfig({
	base: siteBase.endsWith('/') ? siteBase : `${siteBase}/`,
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith('pagefind-'),
				},
			},
		}),
	],
	ssgOptions: {
		script: 'async',
		dirStyle: 'nested',
		includedRoutes() {
			return includedDocRoutes();
		},
	},
});
