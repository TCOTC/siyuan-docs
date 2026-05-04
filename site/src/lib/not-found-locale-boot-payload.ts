import type { ClientShellLocaleWindowPayload, ClientShellUiLocalePatch } from '../i18n/types';
import { appI18nLocales, type AppLocale } from './appLocale';
import { shellUi } from './uiStrings';

/**
 * 由 `shellUi` 组装成供 404 客户端脚本写入 DOM 的扁平载荷。
 * 文案仍以 `i18n/zh` · `i18n/en` 为单一来源，此处只做字段映射，避免在多处手写同一套键。
 */
function buildClientShellUiLocalePatch(locale: AppLocale): ClientShellUiLocalePatch {
	const shell = shellUi(locale);
	return {
		docNavAria: shell.docNavAria,
		skipToContent: shell.skipToContent,
		railSiteLabel: shell.railSiteLabel,
		themeToggleAria: shell.themeToggleAria,
		themeToggleHint: shell.themeToggleHint,
		copyPageMdAria: shell.copyPageMdAria,
		copyPageHint: shell.copyPageHint,
		copyMenuMoreTitle: shell.copyMenuMoreTitle,
		copyMenuMdTitle: shell.copyMenuMdTitle,
		copyMenuMdDesc: shell.copyMenuMdDesc,
		copyMenuViewTitle: shell.copyMenuViewTitle,
		copyMenuViewDesc: shell.copyMenuViewDesc,
		langSwitcherAria: shell.langSwitcherAria,
		langSwitcherHint: shell.langSwitcherHint,
		railMenuOpenAria: shell.railMenuOpenAria,
		railMenuCloseAria: shell.railMenuCloseAria,
		searchHint: shell.searchHint,
		searchOpenAria: shell.searchOpenAria,
		title: `${shell.shellTitle} – ${shell.siteName}`,
		description: shell.shellDescription,
		pagefindLang: locale,
	};
}

function buildClientShellPatchByLocale(): Record<AppLocale, ClientShellUiLocalePatch> {
	return Object.fromEntries(appI18nLocales.map((l) => [l, buildClientShellUiLocalePatch(l)])) as Record<
		AppLocale,
		ClientShellUiLocalePatch
	>;
}

/**
 * `404.astro` 的 Shell 在 SSR 时固定使用 `defaultLocale` 的 `<title>` / meta 与壳层文案。
 * 客户端检出 `loc !== defaultLocale` 时，用 `patchByLocale[loc]` 覆盖 head / 壳层；与 SSR 一致的语言无需改写。
 * `appI18nLocales` 增语言时此处自动带上对应补丁。
 *
 * 与 `i18n-404.ts`、`not-found-locale-head-sync.ts` 中的 `window.__NF_LOCALE__` 结构一致。
 */
export function getNotFoundLocaleWindowConfig(): ClientShellLocaleWindowPayload {
	return {
		base: import.meta.env.BASE_URL,
		patchByLocale: buildClientShellPatchByLocale(),
	};
}
