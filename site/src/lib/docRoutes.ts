import { getRelativeLocaleUrl } from 'astro:i18n';
import type { AppLocale } from './appLocale';

const DOCS_ROOT = 'developers';

/**
 * 站点内文档 URL 路径（不含 base、不含前导斜杠），如 `developers/welcome`、`developers/plugin/plugin-overview`
 */
export function developerDocsUrlPath(docRelPath: string): string {
	const clean = docRelPath.replace(/^\/+/, '').replace(/\/+$/, '');
	return `${DOCS_ROOT}/${clean}`;
}

/**
 * 返回以 `/` 开头的站内路径（不含 `import.meta.env.BASE_URL`），供与 base 拼接
 */
export function developerPageRelativePath(locale: AppLocale, docRelPath: string): string {
	const path = developerDocsUrlPath(docRelPath);
	return getRelativeLocaleUrl(locale, path);
}

export function withBaseUrl(base: string, relativePath: string): string {
	const b = base.endsWith('/') ? base.slice(0, -1) : base;
	const p = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
	return `${b}${p}`;
}
