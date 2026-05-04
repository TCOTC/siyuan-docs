/**
 * 与 `astro.config.ts` 中 `i18n.locales` 同源。
 * 新增语言目录时：在此追加代码、在 `developers/<locale>/` 下放内容，并同步 Astro 路由与 UI（如 `LangSwitcher` 的 `langSwitcherOptionLabel`）。
 *
 * 路径 / 存储 / 浏览器均无法命中站点语言时，回退为 `defaultLocale`（与 Astro `i18n.defaultLocale` 一致）。
 */
export const appI18nLocales = ['en', 'zh'] as const;

export type AppLocale = (typeof appI18nLocales)[number];

/** 各语言的站点路由段（URL 首段、`data-doc-locale`、`data-lang-locale` 等）；与 `appI18nLocales` 同源，键即路由段 */
export const appLocaleCode = Object.fromEntries(
	appI18nLocales.map((loc) => [loc, loc] as const),
) as { readonly [K in AppLocale]: K };

export const defaultLocale: AppLocale = appLocaleCode.en;

/**
 * 语言菜单内各目标站点语言的固定展示名（不按界面语言切换）。
 * 与 `AppLocale` 同步：新增站点语言时须在此补一行。
 */
export const langSwitcherOptionLabel = {
	zh: '中文',
	en: 'English',
} as const satisfies Record<AppLocale, string>;

/**
 * BCP 47 标签：`<html lang>`、`<link rel="alternate" hreflang>`、语言菜单内 `<a hreflang lang>` 共用。
 */
export const localeHtmlLang = {
	en: 'en',
	zh: 'zh-CN',
} as const satisfies Record<AppLocale, string>;

/**
 * `localeCompare` / `Intl.Collator` 使用的 BCP 47 标签。
 * 当前与 `localeHtmlLang` 一致；若将来需区分可单独维护。
 */
export const localeCollatorBcp47 = localeHtmlLang;

/** 按当前界面语言从两套文案中选一套（扩展语言时在 `Record` 中补全键即可） */
export function pickByAppLocale<T>(locale: AppLocale, byLocale: Record<AppLocale, T>): T {
	return byLocale[locale];
}

/**
 * 语言菜单、404 多语言叠放等处：按站点语言代码（`AppLocale`）字面排序。
 */
export function appLocalesForPresentation(): readonly AppLocale[] {
	return [...appI18nLocales].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
