import fs from 'node:fs';
import path from 'node:path';
import { bundleSiteBrowserEntryToIife } from './bundle-site-browser-iife.ts';

/**
 * 键须按「文件名前缀」匹配 `dist/_astro` 产物；更长前缀须先匹配。
 * 与 `Shell.astro` 中 `import …?url` 的入口一一对应；选项须与 `bundle-site-browser-iife` 保持一致。
 */
const SCRIPT_ENTRIES: Record<string, string> = {
	'theme-boot': 'theme-boot.ts',
	'code-copy-i18n-en': 'code-copy-i18n-en.ts',
	'code-copy-i18n-zh': 'code-copy-i18n-zh.ts',
	'doc-scroll-persist-boot': 'doc-scroll-persist-boot.ts',
	'pagefind-loader': 'pagefind-loader.ts',
	'shell-after-load': 'shell-after-load.ts',
	'index-redirect': 'index-redirect.ts',
	'not-found-locale': 'not-found-locale.ts',
};

const SCRIPT_ENTRY_PREFIXES = Object.keys(SCRIPT_ENTRIES).sort((a, b) => b.length - a.length);

/** 在静态站点完整写入 `dist` 之后调用（如 `astro:build:done`） */
export async function rewriteUrlScriptOutputsToIife(siteRoot: string): Promise<void> {
	const outDir = path.join(siteRoot, 'dist/_astro');
	if (!fs.existsSync(outDir)) return;

	const tasks: Promise<void>[] = [];
	for (const file of fs.readdirSync(outDir)) {
		if (!file.endsWith('.js')) continue;
		const prefix = SCRIPT_ENTRY_PREFIXES.find((p) => file.startsWith(`${p}.`));
		if (!prefix) continue;

		const entry = path.join(siteRoot, 'src/scripts', SCRIPT_ENTRIES[prefix]);
		tasks.push(
			bundleSiteBrowserEntryToIife(siteRoot, entry, { minify: true }).then((code) => {
				fs.writeFileSync(path.join(outDir, file), code, 'utf8');
			}),
		);
	}
	await Promise.all(tasks);
}
