import { appI18nLocales, defaultLocale, type AppLocale } from './locales';
import { safeLocalGet, safeLocalSet } from './safeStorage';

const LOCALE_STORAGE_KEY = 'siyuan-docs-locale';

export function normalizeLocale(value: string): AppLocale | null {
	const trimmed = value.trim();
	const found = appI18nLocales.find((loc) => loc.toLowerCase() === trimmed.toLowerCase());
	if (found) return found;
	const lower = trimmed.toLowerCase();
	if (lower.startsWith('zh')) return 'zh-CN';
	if (lower === 'en' || lower.startsWith('en-')) return 'en';
	return null;
}

function localeFromStorage(): AppLocale | null {
	const v = safeLocalGet(LOCALE_STORAGE_KEY);
	return v ? normalizeLocale(v) : null;
}

export function persistLocalePreference(locale: AppLocale): void {
	safeLocalSet(LOCALE_STORAGE_KEY, locale);
}

function localeFromNavigator(): AppLocale | null {
	try {
		const list = navigator.languages?.length ? navigator.languages : [navigator.language];
		for (const raw of list) {
			const loc = normalizeLocale(raw || '');
			if (loc) return loc;
		}
	} catch {
		/* ignore */
	}
	return null;
}

/** localStorage → navigator → 默认语言 */
export function detectLocale(): AppLocale {
	return localeFromStorage() ?? localeFromNavigator() ?? defaultLocale;
}
