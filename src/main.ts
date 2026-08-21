import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import { prepareDocHtml } from './lib/docHtml';
import { stemFromRouteParam } from './lib/docData';
import { normalizeLocale } from './lib/localePreference';
import { routes, scrollBehavior } from './router';
import './styles/global.scss';

export const createApp = ViteSSG(
	App,
	{ routes, base: import.meta.env.BASE_URL, scrollBehavior },
	({ router }) => {
		router.beforeEach(async (to) => {
			const locale = normalizeLocale(String(to.params.locale ?? ''));
			const stem = stemFromRouteParam(to.params.path);
			await prepareDocHtml(locale, stem);
		});
	},
);
