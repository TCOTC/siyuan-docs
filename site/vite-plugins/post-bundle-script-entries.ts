import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';

const SCRIPT_ENTRIES: Record<string, string> = {
	'theme-boot': 'theme-boot.ts',
	'pagefind-loader': 'pagefind-loader.ts',
	'shell-after-load': 'shell-after-load.ts',
	'index-redirect': 'index-redirect.ts',
	'not-found-locale': 'not-found-locale.ts',
};

/** 在静态站点完整写入 `dist` 之后调用（如 `astro:build:done`） */
export async function rewriteBundledScripts(siteRoot: string): Promise<void> {
	const outDir = path.join(siteRoot, 'dist/_astro');
	if (!fs.existsSync(outDir)) return;

	const tasks: Promise<void>[] = [];
	for (const file of fs.readdirSync(outDir)) {
		if (!file.endsWith('.js')) continue;
		const prefix = Object.keys(SCRIPT_ENTRIES).find((p) => file.startsWith(`${p}.`));
		if (!prefix) continue;

		const entry = path.join(siteRoot, 'src/scripts', SCRIPT_ENTRIES[prefix]);
		tasks.push(
			esbuild
				.build({
					absWorkingDir: siteRoot,
					entryPoints: [entry],
					bundle: true,
					write: false,
					format: 'iife',
					platform: 'browser',
					target: 'es2022',
					minify: true,
					legalComments: 'none',
					tsconfig: path.join(siteRoot, 'tsconfig.json'),
				})
				.then((result) => {
					const code = result.outputFiles[0]?.text;
					if (!code) return;
					fs.writeFileSync(path.join(outDir, file), code, 'utf8');
				}),
		);
	}
	await Promise.all(tasks);
}
