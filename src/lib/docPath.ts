/** 语言根路径对应的文档 stem。`index` 不出现在 URL 里，与静态站的 `index.html` 相同 */
export const HOME_STEM = 'index';

/** Vue Router 的 `to`（不含 `BASE_URL`） */
export function docPath(locale: string, stem = HOME_STEM): string {
	const extra = !stem || stem === HOME_STEM ? '' : `${stem}/`;
	return `/${locale}/${extra}`;
}

export function withBase(pathname: string, base: string): string {
	const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${prefix}${pathname}`;
}

/** vite-ssg `includedRoutes`：去掉末尾 `/` */
export function docSsgRoute(locale: string, stem: string): string {
	return docPath(locale, stem).replace(/\/$/, '');
}
