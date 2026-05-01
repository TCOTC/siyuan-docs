import { DOC_SCROLL_SESSION_PREFIX } from '../lib/docScrollSession';

(function docScrollPersistBoot(): void {
	window.addEventListener('pagehide', () => {
		try {
			sessionStorage.setItem(
				DOC_SCROLL_SESSION_PREFIX + location.pathname + location.search,
				String(window.scrollY || 0),
			);
		} catch {
			/* ignore */
		}
	});
})();
