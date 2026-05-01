/** 站内语言偏好（URL / localStorage / navigator），供首页重定向与 404 脚本共用 */

export type SiteLocale = 'zh' | 'en';

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
export function localeFromPath(pathname: string, baseStr: string): SiteLocale | null {
	let p = stripBase(pathname, baseStr);
	if (!p || p.charAt(0) !== '/') {
		p = `/${p || ''}`;
	}
	const seg = p.split('/').filter(Boolean)[0];
	if (seg === 'en') return 'en';
	if (seg === 'zh') return 'zh';
	return null;
}

export function localeFromStorage(): SiteLocale | null {
	try {
		const v = localStorage.getItem('siyuan-docs-locale');
		if (v === 'zh' || v === 'en') return v;
	} catch {
		/* ignore */
	}
	return null;
}

/** 浏览器语言列表中是否偏中文 */
export function localeFromNavigator(): 'zh' | null {
	try {
		const nav = typeof navigator !== 'undefined' ? navigator : null;
		if (!nav) return null;
		const list = nav.languages?.length ? nav.languages : [nav.language];
		for (let i = 0; i < list.length; i++) {
			const raw = (list[i] || '').trim();
			if (!raw) continue;
			const primary = raw.split('-')[0]?.toLowerCase();
			if (primary === 'zh') return 'zh';
		}
	} catch {
		/* ignore */
	}
	return null;
}

/** 首页 `/`：无路径段时的判定顺序 */
export function detectRootLocale(): SiteLocale {
	const fromStore = localeFromStorage();
	if (fromStore) return fromStore;
	const fromNav = localeFromNavigator();
	if (fromNav) return fromNav;
	return 'en';
}

/** 404 等：路径 → 存储 → 浏览器 → 默认英文 */
export function detectLocale(pathname: string, baseStr: string): SiteLocale {
	const fromPath = localeFromPath(pathname, baseStr);
	if (fromPath) return fromPath;
	const fromStore = localeFromStorage();
	if (fromStore) return fromStore;
	const fromNav = localeFromNavigator();
	if (fromNav) return fromNav;
	return 'en';
}
