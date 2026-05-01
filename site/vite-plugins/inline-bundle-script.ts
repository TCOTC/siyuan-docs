import fs from 'node:fs';
import path from 'node:path';
import * as esbuild from 'esbuild';
import type { Plugin, ResolvedConfig } from 'vite';

const VIRTUAL_PREFIX = '\0inline-bundle:';
const QUERY = '?inline-bundle';

/** `Shell` 等处的首屏内联脚本：从 TS 维护，构建期压缩后以字符串导入，最终仍以 `<script is:inline>` 写入 HTML */
export function inlineBundleScript(siteRoot: string): Plugin {
	let minify = false;

	return {
		name: 'inline-bundle-script',
		enforce: 'pre',
		configResolved(config: ResolvedConfig) {
			minify = config.command === 'build';
		},
		async resolveId(id: string, importer?: string) {
			if (!id.includes(QUERY)) return null;
			const bare = id.split('?')[0] ?? '';
			let resolvedPath: string;
			if (path.isAbsolute(bare)) {
				resolvedPath = bare;
			} else if (importer) {
				resolvedPath = path.resolve(path.dirname(importer), bare);
			} else {
				resolvedPath = path.resolve(siteRoot, bare);
			}
			return VIRTUAL_PREFIX + resolvedPath;
		},
		async load(id: string) {
			if (!id.startsWith(VIRTUAL_PREFIX)) return null;
			const file = id.slice(VIRTUAL_PREFIX.length);
			if (!fs.existsSync(file)) {
				this.error(`inline-bundle-script: 找不到入口 ${file}`);
			}
			this.addWatchFile(file);

			const baseDefine = publishedBaseUrlFromEnv();
			const result = await esbuild.build({
				absWorkingDir: siteRoot,
				entryPoints: [file],
				bundle: true,
				write: false,
				format: 'iife',
				platform: 'browser',
				target: 'es2022',
				minify,
				legalComments: 'none',
				tsconfig: path.join(siteRoot, 'tsconfig.json'),
				define: {
					'import.meta.env.BASE_URL': JSON.stringify(baseDefine),
				},
			});
			const code = result.outputFiles[0]?.text;
			if (!code) {
				this.error(`inline-bundle-script: esbuild 未产出 ${file}`);
			}
			return `export default ${JSON.stringify(code)};`;
		},
	};
}

function publishedBaseUrlFromEnv(): string {
	let base = '/';
	const envBase = process.env.ASTRO_BASE_PATH?.trim();
	if (envBase) {
		const withSlash = envBase.startsWith('/') ? envBase : `/${envBase}`;
		base = withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
	}
	return base;
}
