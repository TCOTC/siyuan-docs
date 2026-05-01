import fs from 'node:fs';
import path from 'node:path';
import type { Plugin, ResolvedConfig } from 'vite';
import { bundleSiteBrowserEntryToIife } from './bundle-site-browser-iife.ts';

const VIRTUAL_PREFIX = '\0inline-bundle:';
const QUERY = '?inline-bundle';

/**
 * `Shell` 等处的首屏内联脚本：从 TS 维护，构建期打成 IIFE 字符串导入，最终写入 `<script is:inline>`。
 * 与 `_astro` 收尾覆盖共用 {@link bundleSiteBrowserEntryToIife}，见 `vite-plugins/README.md`。
 */
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
				this.error(`inline-bundle-script: entry not found: ${file}`);
			}
			this.addWatchFile(file);

			try {
				const code = await bundleSiteBrowserEntryToIife(siteRoot, file, { minify });
				return `export default ${JSON.stringify(code)};`;
			} catch (e) {
				const msg = e instanceof Error ? e.message : String(e);
				this.error(`inline-bundle-script: ${msg}`);
			}
		},
	};
}
