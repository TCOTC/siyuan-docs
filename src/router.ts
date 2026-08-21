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

/** 站内切页滚到顶部；同页 hash 交给浏览器；跨页 / 首屏 hash 按元素 id 查找；后退用 savedPosition */
function elementByHash(hash: string): Element | undefined {
	if (typeof document === 'undefined') return undefined;
	const raw = hash.startsWith('#') ? hash.slice(1) : hash;
	if (!raw) return undefined;
	let id = raw;
	try {
		id = decodeURIComponent(raw);
	} catch {
		/* 非法 % 序列时沿用原串 */
	}
	return document.getElementById(id) ?? undefined;
}

export const scrollBehavior: RouterScrollBehavior = async (to, from, savedPosition) => {
	if (savedPosition) {
		await nextTick();
		return savedPosition;
	}
	if (to.hash) {
		if (to.path === from.path) return false;
		await nextTick();
		const el = elementByHash(to.hash);
		if (el) return { el, top: 0 };
		return { top: 0 };
	}
	if (from.matched.length === 0) {
		return false;
	}
	await nextTick();
	return { top: 0 };
};
