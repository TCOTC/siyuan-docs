import { getRelativeLocaleUrl } from 'astro:i18n';
import { appI18nLocales, type AppLocale } from './appLocale';

const DOCS_ROOT = 'developers';

/** 各语言文档区默认入口路径段（与 `developers/<locale>/` 下集合对应） */
export const developerDocHomeSlug = 'welcome';

/**
 * 各站点语言文档首页的相对 href，供首页 `/` 的 `data-index-href-by-locale` 等使用。
 */
export function developerWelcomeHrefByLocale(): Record<AppLocale, string> {
	return Object.fromEntries(
		appI18nLocales.map((l) => [l, developerPageRelativePath(l, developerDocHomeSlug)] as const),
	) as Record<AppLocale, string>;
}

/**
 * 站点内文档 URL 路径（不含 base、不含前导斜杠），如 `developers/welcome`、`developers/plugin/plugin-overview`
 */
export function developerDocsUrlPath(docRelPath: string): string {
	const clean = docRelPath.replace(/^\/+/, '').replace(/\/+$/, '');
	return `${DOCS_ROOT}/${clean}`;
}

/**
 * 返回以 `/` 开头的完整文档路径。`getRelativeLocaleUrl` 会包含 `astro.config` 的 `base`，
 * 勿再与 `import.meta.env.BASE_URL` 手动拼接。
 */
export function developerPageRelativePath(locale: AppLocale, docRelPath: string): string {
	const path = developerDocsUrlPath(docRelPath);
	return getRelativeLocaleUrl(locale, path);
}
