/**
 * 占位与 Pagefind 宿主分时挂载，避免双按钮。
 * bundle 路径来自 `<meta name="pagefind-bundle">`。
 */
let loaderStarted = false;
let pagefindScriptLoaded = false;
let uiReadyMarked = false;

function markPagefindUiReady(): void {
	if (uiReadyMarked) return;
	uiReadyMarked = true;
	document.documentElement.setAttribute('data-pagefind-ui-ready', '');
}

function mountModalTriggers(): void {
	for (const wrap of document.querySelectorAll('[data-pf-trigger-mount]')) {
		if (wrap.querySelector('pagefind-modal-trigger')) continue;
		const ph = wrap.querySelector('.pf-search-placeholder');
		const el = document.createElement('pagefind-modal-trigger');
		el.className = 'pf-trigger-wrap';
		el.setAttribute('compact', '');
		el.setAttribute('placeholder', '');
		el.setAttribute('shortcut', '__pagefind_no_hotkey__');
		el.setAttribute('hide-shortcut', '');
		wrap.appendChild(el);
		ph?.parentNode?.removeChild(ph);
	}
	markPagefindUiReady();
}

export function closePagefindModal(): void {
	const modal = document.querySelector('pagefind-modal');
	if (!modal) return;
	const host = modal as HTMLElement & { close?: () => void; hide?: () => void };
	if (typeof host.close === 'function') {
		host.close();
		return;
	}
	if (typeof host.hide === 'function') {
		host.hide();
		return;
	}
	modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

export function startPagefindLoader(): void {
	if (pagefindScriptLoaded && customElements.get('pagefind-modal-trigger')) {
		mountModalTriggers();
		return;
	}
	if (loaderStarted) return;
	const meta = document.querySelector('meta[name="pagefind-bundle"]');
	const bundle = meta?.getAttribute('content');
	if (!bundle) return;
	loaderStarted = true;

	const cssHref = `${bundle}pagefind-component-ui.css`;
	const jsSrc = `${bundle}pagefind-component-ui.js`;

	function loadPagefind(): void {
		if (pagefindScriptLoaded) return;
		pagefindScriptLoaded = true;
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		document.head.appendChild(link);
		const script = document.createElement('script');
		script.type = 'module';
		script.src = jsSrc;
		script.onload = (): void => {
			void customElements.whenDefined('pagefind-modal-trigger').then(mountModalTriggers).catch(mountModalTriggers);
		};
		document.head.appendChild(script);
	}

	const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
	ric(
		() => {
			loadPagefind();
		},
		{ timeout: 2000 },
	);

	document.addEventListener(
		'pointerdown',
		(e: PointerEvent) => {
			if (pagefindScriptLoaded) return;
			const el = e.target;
			if (!(el instanceof Element)) return;
			if (el.closest('.pf-search-placeholder, .pf-trigger-stack, [data-pf-trigger-mount]')) {
				loadPagefind();
			}
		},
		true,
	);
}
