import { shellUi } from '../lib/uiStrings';

(function injectCodeCopyI18n(): void {
	const t = shellUi('en');
	const el = document.createElement('script');
	el.type = 'application/json';
	el.id = 'siyuan-code-copy-i18n';
	el.textContent = JSON.stringify({
		copyAria: t.copyCodeBlockAria,
		copiedAria: t.copyCodeBlockCopiedAria,
		failedAria: t.copyCodeBlockFailedAria,
	});
	document.head.appendChild(el);
})();
