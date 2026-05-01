import path from 'node:path';
import * as esbuild from 'esbuild';
import { publishedSiteBaseUrlFromEnv } from './lib/publishedSiteBaseUrl.ts';

/** 与 `astro.config` 里 `vite.build.target` 对齐 */
export const SITE_BROWSER_IIFE_TARGET = 'es2022' as const;

/**
 * 站点「必须在浏览器里以单文件 IIFE 执行」的入口统一走这里。
 *
 * 主站仍只由 Astro + Vite（Rollup）打包；本函数仅在两类场景被调用：
 *
 * 1. `?inline-bundle`（`inline-bundle-script` 插件）：产出字符串写入 `<script is:inline>`。
 * 2. `astro:build:done`（`rewrite-url-script-outputs-to-iife`）：用相同选项覆盖部分 `_astro/*.js`，
 *    与 `import.meta.env.BASE_URL` 及 `ExternalScript.astro` 中的 classic / module 约定一致。
 *
 * 二者共用本模块，避免「Vite 一套、esbuild 另一套」的配置漂移。
 */
export function siteBrowserImportMetaEnvDefine(): Record<string, string> {
	return {
		'import.meta.env.BASE_URL': JSON.stringify(publishedSiteBaseUrlFromEnv()),
	};
}

export async function bundleSiteBrowserEntryToIife(
	siteRoot: string,
	entryAbsolutePath: string,
	options: { minify: boolean },
): Promise<string> {
	const result = await esbuild.build({
		absWorkingDir: siteRoot,
		entryPoints: [entryAbsolutePath],
		bundle: true,
		write: false,
		format: 'iife',
		platform: 'browser',
		target: SITE_BROWSER_IIFE_TARGET,
		minify: options.minify,
		legalComments: 'none',
		tsconfig: path.join(siteRoot, 'tsconfig.json'),
		define: siteBrowserImportMetaEnvDefine(),
	});
	const text = result.outputFiles[0]?.text;
	if (!text) {
		throw new Error(`[site] IIFE bundle produced no output: ${entryAbsolutePath}`);
	}
	return text;
}
