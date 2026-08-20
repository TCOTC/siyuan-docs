import { nextTick } from 'vue';
import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';
import HomeRedirect from './pages/HomeRedirect.vue';
import DocPage from './pages/DocPage.vue';
import NotFound from './pages/NotFound.vue';

export const routes: RouteRecordRaw[] = [
	{ path: '/', component: HomeRedirect, name: 'home' },
	{ path: '/404', component: NotFound, name: 'not-found-page' },
	{ path: '/:locale(en|zh-CN)', component: DocPage, name: 'doc-locale-root' },
	{ path: '/:locale(en|zh-CN)/:path(.*)', component: DocPage, name: 'doc' },
	{ path: '/:pathMatch(.*)*', component: NotFound, name: 'not-found' },
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
