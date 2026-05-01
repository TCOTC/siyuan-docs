/**
 * 与 `astro.config.ts` 中 `i18n.locales` 同源。
 * 新增语言目录时：在此追加代码、在 `developers/<locale>/` 下放内容，并同步 Astro 路由与 UI（如 LangSwitcher）。
 */
export const appI18nLocales = ['zh', 'en'] as const;

export type AppLocale = (typeof appI18nLocales)[number];

export const defaultLocale: AppLocale = 'zh';
