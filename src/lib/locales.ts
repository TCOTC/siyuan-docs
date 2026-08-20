export const appI18nLocales = ['en', 'zh-CN'] as const;

export type AppLocale = (typeof appI18nLocales)[number];

export const defaultLocale: AppLocale = 'en';

export const langSwitcherOptionLabel = {
	'zh-CN': '中文',
	en: 'English',
} as const satisfies Record<AppLocale, string>;

export const localeHtmlLang = {
	en: 'en',
	'zh-CN': 'zh-CN',
} as const satisfies Record<AppLocale, string>;

export const appLocalesForPresentation: readonly AppLocale[] = [...appI18nLocales].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
