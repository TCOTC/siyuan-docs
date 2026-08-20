import type { AppLocale } from './locales';
import type { NavGroupKey } from './docMeta';

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
	order: number;
	html: string;
	headings: TocHeading[];
	sourcePath: string;
	markdown: string;
};

export type NavItem = {
	stem: string;
	title: string;
};

export type NavGroup = {
	key: NavGroupKey;
	label: string;
	items: NavItem[];
};

export type GeneratedDocs = {
	docs: DocRecord[];
	nav: Record<AppLocale, NavGroup[]>;
	homeStem: string;
};

export function docHref(locale: AppLocale, stem: string, base = import.meta.env.BASE_URL): string {
	const prefix = base.endsWith('/') ? base.slice(0, -1) : base;
	return `${prefix}/${locale}/${stem}/`;
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
