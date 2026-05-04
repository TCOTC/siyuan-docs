import path from 'node:path';
import { buildSync } from 'esbuild';
import type { ClientShellLocaleWindowPayload } from '../i18n/types';

export type { ClientShellLocaleWindowPayload };

/** Astro / Vite 打包后 `import.meta.url` 落在 `dist`，不可用路径推演源码目录；以执行目录为 `site` 包根目录为准 */
function sitePackageRoot(): string {
	return process.cwd();
}

const runtimeEntry = path.join(sitePackageRoot(), 'src/scripts/not-found-head-sync-runtime.ts');

let cachedRuntimeIife: string | undefined;

function getNotFoundHeadSyncRuntimeIife(): string {
	if (cachedRuntimeIife !== undefined) return cachedRuntimeIife;

	const result = buildSync({
		absWorkingDir: sitePackageRoot(),
		entryPoints: [runtimeEntry],
		bundle: true,
		format: 'iife',
		platform: 'browser',
		target: 'es2020',
		minify: true,
		write: false,
	});

	const text = result.outputFiles[0]?.text;
	if (!text) throw new Error('esbuild returned empty bundle for not-found-head-sync-runtime');

	cachedRuntimeIife = text;
	return cachedRuntimeIife;
}

/**
 * 404 head 内联同步脚本：首段写入 `window.__NF_LOCALE__`，第二段为打包后的 runtime，
 * 在解析到 `<body>` 之前设置 `data-doc-locale`、`lang` 与非默认语言的 title / description。
 */
export function buildInlineNotFoundLocaleHeadScriptContent(cfg: ClientShellLocaleWindowPayload): string {
	const payload = JSON.stringify(cfg).replace(/</g, '\\u003c');
	return `window.__NF_LOCALE__=${payload};${getNotFoundHeadSyncRuntimeIife()}`;
}
