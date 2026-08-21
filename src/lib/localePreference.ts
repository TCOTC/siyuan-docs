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

function stripBase(pathname: string, baseStr: string): string {
	const b = baseStr.replace(/\/$/, '');
	if (!b) return pathname;
	if (pathname.startsWith(b)) {
		const rest = pathname.slice(b.length);
		return rest || '/';
	}
	return pathname;
}

function localeFromPath(pathname: string, baseStr: string): AppLocale | null {
	let p = stripBase(pathname, baseStr);
	if (!p.startsWith('/')) p = `/${p}`;
	const seg = p.split('/').filter(Boolean)[0];
	return seg ? normalizeLocale(seg) : null;
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

/** 可选从当前路径读语言段；否则依次为 localStorage、navigator、默认语言 */
export function detectLocale(pathname?: string, baseStr?: string): AppLocale {
	if (pathname != null && baseStr != null) {
		const fromPath = localeFromPath(pathname, baseStr);
		if (fromPath) return fromPath;
	}
	return localeFromStorage() ?? localeFromNavigator() ?? defaultLocale;
}
