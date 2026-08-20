import { appI18nLocales, defaultLocale, type AppLocale } from './locales';

export function isSiteLocale(value: unknown): value is AppLocale {
	if (typeof value !== 'string') return false;
	return normalizeLocale(value) != null;
}

export function normalizeLocale(value: string): AppLocale | null {
	const trimmed = value.trim();
	const found = appI18nLocales.find((loc) => loc.toLowerCase() === trimmed.toLowerCase());
	if (found) return found;
	const lower = trimmed.toLowerCase();
	if (lower.startsWith('zh')) return 'zh-CN';
	if (lower === 'en' || lower.startsWith('en-')) return 'en';
	return null;
}

export function stripBase(pathname: string, baseStr: string): string {
	const b = baseStr.replace(/\/$/, '');
	if (!b) return pathname;
	if (pathname.startsWith(b)) {
		const rest = pathname.slice(b.length);
		return rest || '/';
	}
	return pathname;
}

export function localeFromPath(pathname: string, baseStr: string): AppLocale | null {
	let p = stripBase(pathname, baseStr);
	if (!p.startsWith('/')) p = `/${p}`;
	const seg = p.split('/').filter(Boolean)[0];
	return seg ? normalizeLocale(seg) : null;
}

export function localeFromStorage(): AppLocale | null {
	try {
		const v = localStorage.getItem('siyuan-docs-locale');
		return v ? normalizeLocale(v) : null;
	} catch {
		return null;
	}
}

export function localeFromNavigator(): AppLocale | null {
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

export function detectRootLocale(): AppLocale {
	return localeFromStorage() ?? localeFromNavigator() ?? defaultLocale;
}

export function detectLocale(pathname: string, baseStr: string): AppLocale {
	return localeFromPath(pathname, baseStr) ?? localeFromStorage() ?? localeFromNavigator() ?? defaultLocale;
}
