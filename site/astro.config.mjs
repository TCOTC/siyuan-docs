// @ts-check
import { defineConfig } from 'astro/config';

/** GitHub Pages 项目站时可在 CI 设置 `ASTRO_BASE_PATH=/仓库名`（无前导或带 / 均可） */
let base = '/';
const envBase = process.env.ASTRO_BASE_PATH?.trim();
if (envBase) {
	const withSlash = envBase.startsWith('/') ? envBase : `/${envBase}`;
	base = withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
}

// https://astro.build/config
export default defineConfig({
	output: 'static',
	base,
});
