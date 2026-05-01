import type { AppLocale } from './appLocale';
import type { NotFoundLocalePatch } from './notFoundLocale';
import { notFoundUi, pagefindToolbarUi, shellUi } from './uiStrings';

const DOCS_ROOT = 'developers';

/**
 * 与 `docRoutes.developerPageRelativePath` 在「前缀语言 + base」规则上对齐，供浏览器入口打包；
 * 不依赖 `astro:i18n`，避免站点 IIFE 打包（`bundle-site-browser-iife`）无法解析虚拟模块。
 */
export function developerPagePathForStaticSite(locale: AppLocale, docRelPath: string): string {
	const clean = docRelPath.replace(/^\/+/, '').replace(/\/+$/, '');
	const raw = import.meta.env.BASE_URL;
	const baseNorm = raw === '/' ? '' : raw.replace(/\/$/, '');
	const loc = locale === 'zh' ? 'zh' : 'en';
	const rel = `${loc}/${DOCS_ROOT}/${clean}/`;
	return (baseNorm ? `${baseNorm}/${rel}` : `/${rel}`).replace(/\/{2,}/g, '/');
}

/** 404 页 head 外链脚本与 `i18n-404.ts` 共用的 `window.__NF_LOCALE__` 载荷（构建期固定） */
export function getNotFoundLocaleWindowConfig(): { base: string; patchZh: NotFoundLocalePatch } {
	const base = import.meta.env.BASE_URL;
	const nfZh = notFoundUi('zh');
	const tShellZh = shellUi('zh');
	const pfZh = pagefindToolbarUi('zh');

	const patchZh: NotFoundLocalePatch = {
		title: `${nfZh.shellTitle} – ${tShellZh.siteName}`,
		description: nfZh.shellDescription,
		pagefindLang: 'zh',
		docNavAria: tShellZh.docNavAria,
		skipToContent: tShellZh.skipToContent,
		railBrandHref: developerPagePathForStaticSite('zh', 'welcome'),
		railSiteLabel: tShellZh.railSiteLabel,
		searchHint: pfZh.searchHint,
		searchOpenAria: pfZh.searchOpenAria,
		themeToggleAria: tShellZh.themeToggleAria,
		themeToggleHint: tShellZh.themeToggleHint,
		copyPageMdAria: tShellZh.copyPageMdAria,
		copyPageHint: tShellZh.copyPageHint,
		copyMenuMoreTitle: tShellZh.copyMenuMoreTitle,
		copyMenuMdTitle: tShellZh.copyMenuMdTitle,
		copyMenuMdDesc: tShellZh.copyMenuMdDesc,
		copyMenuViewTitle: tShellZh.copyMenuViewTitle,
		copyMenuViewDesc: tShellZh.copyMenuViewDesc,
		langSwitcherAria: tShellZh.langSwitcherAria,
		langSwitcherHint: tShellZh.langSwitcherHint,
		railMenuOpenAria: tShellZh.railMenuOpenAria,
		railMenuCloseAria: tShellZh.railMenuCloseAria,
	};

	return { base, patchZh };
}
