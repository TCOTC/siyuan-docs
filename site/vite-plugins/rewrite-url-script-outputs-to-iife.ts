import fs from 'node:fs';
import path from 'node:path';
import { bundleSiteBrowserEntryToIife } from './bundle-site-browser-iife.ts';

/**
 * 键须按「文件名前缀」匹配 `dist/_astro` 产物；更长前缀须先匹配。
 * 与 `Shell.astro`、`NotFoundLocaleHeadScript.astro` 等处 `import …?url` 的入口一一对应；选项须与 `bundle-site-browser-iife` 保持一致。
 */
const SCRIPT_ENTRIES: Record<string, string> = {
	'theme-boot': 'theme-boot.ts',
	'i18n-404': 'i18n-404.ts',
	'scroll-persist': 'scroll-persist.ts',
	'pagefind-loader': 'pagefind-loader.ts',
	'shell-after-load': 'shell-after-load.ts',
	'index-redirect': 'index-redirect.ts',
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

const DOC_READING_FRAME_CSS = /^doc-reading-frame\.([^.]+)\.css$/;

/**
 * Astro 构建末期仍会按 chunk 名输出 `doc-reading-frame.*.css`；在写入 `dist` 后改为 `style.*.css`，与源码 `doc-reading-frame.ts` 解耦。
 */
export function renameDocReadingFrameCssToStyle(siteRoot: string): void {
	const distPath = path.join(siteRoot, 'dist');
	const astroDir = path.join(distPath, '_astro');
	if (!fs.existsSync(astroDir)) return;
	const oldFile = fs.readdirSync(astroDir).find((f) => DOC_READING_FRAME_CSS.test(f));
	if (!oldFile) return;
	const legacyCssName = oldFile;
	const hash = legacyCssName.match(DOC_READING_FRAME_CSS)?.[1];
	if (!hash) return;
	const newFile = `style.${hash}.css`;
	fs.renameSync(path.join(astroDir, legacyCssName), path.join(astroDir, newFile));

	function patchFile(filePath: string): void {
		let s = fs.readFileSync(filePath, 'utf8');
		const next = s.split(legacyCssName).join(newFile);
		if (next !== s) fs.writeFileSync(filePath, next, 'utf8');
	}

	function walk(dir: string): void {
		for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
			const p = path.join(dir, ent.name);
			if (ent.isDirectory()) walk(p);
			else if (ent.isFile() && (ent.name.endsWith('.html') || ent.name.endsWith('.md'))) patchFile(p);
		}
	}
	walk(distPath);
}
