/** 站内语言偏好（URL / localStorage / navigator），供首页重定向与 404 脚本共用 */

import { type AppLocale, appI18nLocales, defaultLocale } from './appLocale';

export function isSiteLocale(value: any): value is AppLocale {
	return (appI18nLocales as readonly string[]).includes(value);
}

export function stripBase(pathname: string, baseStr: string): string {
	const b = baseStr.replace(/\/$/, '');
	if (!b) return pathname;
	if (pathname.indexOf(b) === 0) {
		const rest = pathname.slice(b.length);
		return rest || '/';
	}
	return pathname;
}

/** 从路径首段解析 locale（未命中返回 null） */
export function localeFromPath(pathname: string, baseStr: string): AppLocale | null {
	let p = stripBase(pathname, baseStr);
	if (!p || p.charAt(0) !== '/') {
		p = `/${p || ''}`;
	}
	const seg = p.split('/').filter(Boolean)[0];
	if (isSiteLocale(seg)) return seg;
	return null;
}

export function localeFromStorage(): AppLocale | null {
	try {
		const v = localStorage.getItem('siyuan-docs-locale');
		if (isSiteLocale(v)) return v;
	} catch {
		/* ignore */
	}
	return null;
}

/**
 * 按 `navigator.languages` 顺序，取第一个 primary 语言标签（如 `en-US` → `en`）
 * 且落在 `appI18nLocales` 中的站点语言。
 */
export function localeFromNavigator(): AppLocale | null {
	try {
		const nav = typeof navigator !== 'undefined' ? navigator : null;
		if (!nav) return null;
		const list = nav.languages?.length ? nav.languages : [nav.language];
		for (let i = 0; i < list.length; i++) {
			const raw = (list[i] || '').trim();
			if (!raw) continue;
			const primary = raw.split('-')[0]?.toLowerCase();
			if (isSiteLocale(primary)) return primary;
		}
	} catch {
		/* ignore */
	}
	return null;
}

/**
 * 解析首页 `data-index-href-by-locale` 的 JSON；必须包含且仅包含 `appI18nLocales` 中各键的非空字符串，否则返回 null。
 */
export function parseIndexHrefByLocaleJson(raw: string | null): Record<AppLocale, string> | null {
	if (raw == null || raw === '') return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
	const o = parsed as Record<string, unknown>;
	const out = {} as Record<AppLocale, string>;
	for (const loc of appI18nLocales) {
		const v = o[loc];
		if (typeof v !== 'string' || v.length === 0) return null;
		out[loc] = v;
	}
	return out;
}

/** 首页 `/`：无路径段时的判定顺序 */
export function detectRootLocale(): AppLocale {
	const fromStore = localeFromStorage();
	if (fromStore) return fromStore;
	const fromNav = localeFromNavigator();
	if (fromNav) return fromNav;
	return defaultLocale;
}

/** 404 等：路径 → 存储 → 浏览器 → 回退语言 */
export function detectLocale(pathname: string, baseStr: string): AppLocale {
	const fromPath = localeFromPath(pathname, baseStr);
	if (fromPath) return fromPath;
	const fromStore = localeFromStorage();
	if (fromStore) return fromStore;
	const fromNav = localeFromNavigator();
	if (fromNav) return fromNav;
	return defaultLocale;
}
