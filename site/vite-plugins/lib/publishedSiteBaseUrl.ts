/**
 * 与 `astro.config.ts` 的 `base` 同源，供内联脚本与 post-build IIFE 的 `define` 注入 `import.meta.env.BASE_URL`。
 * 仅应在构建 / Vite 插件中使用，勿引入到浏览器 bundle。
 */
export function publishedSiteBaseUrlFromEnv(): string {
	let base = '/';
	const envBase = process.env.ASTRO_BASE_PATH?.trim();
	if (envBase) {
		const withSlash = envBase.startsWith('/') ? envBase : `/${envBase}`;
		base = withSlash.endsWith('/') ? withSlash : `${withSlash}/`;
	}
	return base;
}
