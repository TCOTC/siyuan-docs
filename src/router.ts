import { nextTick } from 'vue';
import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';
import DocPage from './pages/DocPage.vue';
import { detectLocale } from './lib/localePreference';
import { docPath } from './lib/docPath';
import { appI18nLocales, defaultLocale } from './lib/locales';

const localeParam = appI18nLocales.join('|');

export const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'home',
		redirect: () => docPath(import.meta.env.SSR ? defaultLocale : detectLocale()),
	},
	{ path: '/404', component: DocPage, name: 'not-found-page' },
	{ path: `/:locale(${localeParam})`, component: DocPage, name: 'doc-locale-root' },
	{ path: `/:locale(${localeParam})/:path(.*)`, component: DocPage, name: 'doc' },
	{ path: '/:pathMatch(.*)*', component: DocPage, name: 'not-found' },
];

/** 站内切页滚到顶部；同页 hash 交给浏览器；浏览器后退用 savedPosition */
export const scrollBehavior: RouterScrollBehavior = async (to, from, savedPosition) => {
	if (savedPosition) {
		await nextTick();
		return savedPosition;
	}
	if (to.hash) {
		if (to.path === from.path) return false;
		await nextTick();
		return { el: to.hash, top: 0 };
	}
	if (from.matched.length === 0) {
		return false;
	}
	await nextTick();
	return { top: 0 };
};
