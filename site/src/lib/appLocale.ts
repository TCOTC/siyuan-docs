/**
 * 与 `astro.config.ts` 中 `i18n.locales` 同源。
 * 新增语言目录时：在此追加代码、在 `developers/<locale>/` 下放内容，并同步 Astro 路由与 UI（如 LangSwitcher）。
 *
 * **顺序**：第一项为 `localePreferenceFallback`（路径 / 存储 / 浏览器均无法命中时的回退）。
 * 若回退应固定为某一语言（例如 `en`），请保持该语言在首位；新增其它语言时插在末尾。
 */
export const appI18nLocales = ['en', 'zh'] as const;

export type AppLocale = (typeof appI18nLocales)[number];

export const defaultLocale: AppLocale = 'zh';

/** 由 `appI18nLocales` 首项推导，与 Astro `defaultLocale` 可不同 */
export const localePreferenceFallback: AppLocale = appI18nLocales[0];

/** `<html lang>` 使用的 BCP 47 标签（按站点语言代码映射） */
export const localeHtmlLang = {
	en: 'en',
	zh: 'zh-CN',
} as const satisfies Record<AppLocale, string>;
