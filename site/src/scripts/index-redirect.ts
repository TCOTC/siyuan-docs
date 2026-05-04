import { pickByAppLocale } from '../lib/appLocale';
import { detectRootLocale, parseIndexHrefByLocaleJson } from '../lib/localePreference';

(function runIndexRedirect(): void {
	const root = document.documentElement;
	const hrefByLocale = parseIndexHrefByLocaleJson(root.getAttribute('data-index-href-by-locale'));
	if (!hrefByLocale) return;
	const loc = detectRootLocale();
	location.replace(pickByAppLocale(loc, hrefByLocale));
})();
