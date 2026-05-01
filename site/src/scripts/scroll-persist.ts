import { DOC_SCROLL_SESSION_PREFIX } from '../lib/docScrollSession';
import { safeSessionSet } from './lib/safe-storage';

(function scrollPersistBoot(): void {
	window.addEventListener('pagehide', () => {
		safeSessionSet(
			DOC_SCROLL_SESSION_PREFIX + location.pathname + location.search,
			String(window.scrollY),
		);
	});
})();
