export const appI18nLocales = ['en', 'zh-CN'] as const;

export type AppLocale = (typeof appI18nLocales)[number];

export const defaultLocale: AppLocale = 'en';

export const langSwitcherOptionLabel = {
	'zh-CN': '中文',
	en: 'English',
} as const satisfies Record<AppLocale, string>;
