/**
 * 由 `not-found-locale-head-sync` 在构建时打成 IIFE，紧随 `window.__NF_LOCALE__ = …` 执行。
 * 逻辑与 `localePreference.detectLocale` 同源（直接 import），不再维护一份字符串拷贝。
 */
import { defaultLocale, localeHtmlLang } from '../lib/appLocale';
import { detectLocale } from '../lib/localePreference';
import type { ClientShellLocaleWindowPayload } from '../i18n/types';

declare global {
	interface Window {
		__NF_LOCALE__?: ClientShellLocaleWindowPayload;
	}
}

(function runNotFoundHeadSyncFromCfg(): void {
	const cfg = window.__NF_LOCALE__;
	if (!cfg) return;

	const loc = detectLocale(
		typeof location !== 'undefined' ? location.pathname : '/',
		cfg.base,
	);

	document.documentElement.setAttribute('data-doc-locale', loc);
	document.documentElement.setAttribute('lang', localeHtmlLang[loc] ?? loc);

	if (loc === defaultLocale) return;

	const p = cfg.patchByLocale[loc];
	if (!p) return;

	document.title = p.title;
	const meta = document.querySelector('meta[name="description"]');
	if (meta) meta.setAttribute('content', p.description);
})();
