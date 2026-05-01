import { detectRootLocale } from '../lib/localePreference';

(function runIndexRedirect(): void {
	const root = document.documentElement;
	const zhWelcome = root.getAttribute('data-index-zh');
	const enWelcome = root.getAttribute('data-index-en');
	if (!zhWelcome || !enWelcome) return;
	const loc = detectRootLocale();
	location.replace(loc === 'zh' ? zhWelcome : enWelcome);
})();
