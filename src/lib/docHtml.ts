import { reactive } from 'vue';
import type { AppLocale } from './locales';

type DocHtmlModule = {
	html?: string;
	default?: { html?: string };
};

type DocHtmlLoaders = Record<string, () => Promise<DocHtmlModule>>;

const htmlCache = reactive(new Map<string, string>());
let loadersPromise: Promise<DocHtmlLoaders> | undefined;

function docHtmlCacheKey(locale: AppLocale, stem: string): string {
	return `${locale}:${stem}`;
}

export function getDocHtml(locale: AppLocale, stem: string): string {
	return htmlCache.get(docHtmlCacheKey(locale, stem)) ?? '';
}

function htmlFromModule(mod: DocHtmlModule): string {
	if (typeof mod.html === 'string') return mod.html;
	if (typeof mod.default?.html === 'string') return mod.default.html;
	return '';
}

function loadersMap(): Promise<DocHtmlLoaders> {
	loadersPromise ??= import('#doc-html-loaders').then((m) => m.loaders);
	return loadersPromise;
}

/** 路由守卫里预取当前页正文；已缓存则跳过 */
export async function prepareDocHtml(locale: AppLocale | null, stem: string): Promise<void> {
	if (!locale) return;
	const key = docHtmlCacheKey(locale, stem);
	if (htmlCache.has(key)) return;
	const loader = (await loadersMap())[key];
	if (!loader) {
		htmlCache.set(key, '');
		return;
	}
	htmlCache.set(key, htmlFromModule(await loader()));
}
