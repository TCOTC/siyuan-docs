import type { AppLocale } from './locales';
import { HOME_STEM } from './docMeta';

export type TocHeading = {
	depth: number;
	slug: string;
	text: string;
};

export type DocRecord = {
	locale: AppLocale;
	stem: string;
	title: string;
	description?: string;
	html: string;
	headings: TocHeading[];
	sourcePath: string;
	markdown: string;
};

export type NavItem = {
	stem: string;
	title: string;
};

export type RailPage = {
	type: 'page';
	stem: string;
	title: string;
};

export type NavGroup = {
	type: 'group';
	key: string;
	label: string;
	items: NavItem[];
};

export type RailEntry = RailPage | NavGroup;

export type GeneratedDocs = {
	docs: DocRecord[];
	nav: Record<AppLocale, RailEntry[]>;
	homeStem: string;
};

export function railGroupContaining(entries: RailEntry[], stem: string): NavGroup | undefined {
	return entries.find((e): e is NavGroup => e.type === 'group' && e.items.some((i) => i.stem === stem));
}

/** Vue Router 的 `to`（不含 `BASE_URL`）；首页 `home` 对应语言根路径 */
export function docPath(locale: AppLocale, stem: string): string {
	if (stem === HOME_STEM) return `/${locale}/`;
	return `/${locale}/${stem}/`;
}

export function docHref(locale: AppLocale, stem: string, base = import.meta.env.BASE_URL): string {
	const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${prefix}${docPath(locale, stem)}`;
}

/** 从 `/:locale` 或 `/:locale/:path(.*)` 取出文档 stem（空路径即首页） */
export function stemFromRouteParam(pathParam: unknown): string {
	const raw = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam ?? '');
	const stem = raw.replace(/\/+$/, '');
	return stem === '' ? HOME_STEM : stem;
}

export function githubBlobUrl(sourcePath: string): string {
	return `https://github.com/TCOTC/siyuan-docs/blob/main/${sourcePath}`;
}

export function findDoc(docs: DocRecord[], locale: AppLocale, stem: string): DocRecord | undefined {
	return docs.find((d) => d.locale === locale && d.stem === stem);
}

export function siblingDoc(docs: DocRecord[], locale: AppLocale, stem: string): DocRecord | undefined {
	return findDoc(docs, locale, stem);
}
