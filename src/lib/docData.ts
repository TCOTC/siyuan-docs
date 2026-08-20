import type { AppLocale } from './locales';
import { HOME_STEM, docPath, withBase } from './docPath';

export { HOME_STEM, docPath };

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

export type RailPage = {
	type: 'page';
	stem: string;
	title: string;
};

export type NavGroup = {
	type: 'group';
	key: string;
	label: string;
	items: { stem: string; title: string }[];
};

export type RailEntry = RailPage | NavGroup;

export type GeneratedDocs = {
	docs: DocRecord[];
	nav: Record<AppLocale, RailEntry[]>;
};

export function railGroupContaining(entries: RailEntry[], stem: string): NavGroup | undefined {
	return entries.find((e): e is NavGroup => e.type === 'group' && e.items.some((i) => i.stem === stem));
}

export function docHref(locale: AppLocale, stem: string, base = import.meta.env.BASE_URL): string {
	return withBase(docPath(locale, stem), base);
}

/** 站内纯文本 Markdown：`/{locale}/{stem}/` 对应 `/{locale}/{stem}.md` */
export function docMarkdownHref(locale: AppLocale, stem: string, base = import.meta.env.BASE_URL): string {
	return withBase(`/${locale}/${stem}.md`, base);
}

/** 从 `/:locale` 或 `/:locale/:path(.*)` 取出文档 stem（空路径即首页） */
export function stemFromRouteParam(pathParam: unknown): string {
	const raw = Array.isArray(pathParam) ? pathParam.join('/') : String(pathParam ?? '');
	const stem = raw.replace(/\/+$/, '');
	return stem === '' ? HOME_STEM : stem;
}

export function findDoc(docs: DocRecord[], locale: AppLocale, stem: string): DocRecord | undefined {
	return docs.find((d) => d.locale === locale && d.stem === stem);
}
