import type { RouteRecordRaw } from 'vue-router';
import HomeRedirect from './pages/HomeRedirect.vue';
import DocPage from './pages/DocPage.vue';
import NotFound from './pages/NotFound.vue';
import generated from './generated/docs.json';
import { docHref, type GeneratedDocs } from './lib/docData';
import { appI18nLocales } from './lib/locales';
import { NAV_GROUP_KEYS } from './lib/docMeta';

const data = generated as GeneratedDocs;

function firstStem(locale: (typeof appI18nLocales)[number], group: string): string | undefined {
	const groups = data.nav[locale] ?? [];
	const g = groups.find((x) => x.key === group);
	return g?.items[0]?.stem;
}

const folderRedirects: RouteRecordRaw[] = [];
for (const locale of appI18nLocales) {
	for (const key of NAV_GROUP_KEYS) {
		const stem = firstStem(locale, key);
		if (!stem) continue;
		folderRedirects.push({
			path: `/${locale}/${key}/`,
			redirect: docHref(locale, stem),
		});
		folderRedirects.push({
			path: `/${locale}/${key}`,
			redirect: docHref(locale, stem),
		});
	}
}

export const routes: RouteRecordRaw[] = [
	{ path: '/', component: HomeRedirect, name: 'home' },
	{ path: '/404', component: NotFound, name: 'not-found-page' },
	...folderRedirects,
	{ path: '/:locale(en|zh-CN)/:path(.*)', component: DocPage, name: 'doc' },
	{ path: '/:pathMatch(.*)*', component: NotFound, name: 'not-found' },
];
