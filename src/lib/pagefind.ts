/**
 * 占位与 Pagefind 宿主分时挂载，避免同一槽内双按钮。
 * bundle 路径来自参数或 `<meta name="pagefind-bundle">`。
 */
let idleScheduled = false;
let pointerBound = false;
let loadInFlight = false;
let pagefindReady = false;
let resolvedBundle = '';

function markPagefindUiReady(): void {
	document.documentElement.setAttribute('data-pagefind-ui-ready', '');
}

function bundlePath(explicit?: string): string {
	if (explicit) return explicit;
	if (resolvedBundle) return resolvedBundle;
	const meta = document.querySelector('meta[name="pagefind-bundle"]');
	return meta?.getAttribute('content') ?? '';
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

/** 已加载时补挂缺失的 trigger（切页后 v-once 槽位通常仍在） */
export function ensurePagefindTriggers(): void {
	if (!pagefindReady || !customElements.get('pagefind-modal-trigger')) return;
	mountModalTriggers();
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

function finishLoadSuccess(): void {
	pagefindReady = true;
	loadInFlight = false;
	mountModalTriggers();
}

function finishLoadFailure(): void {
	loadInFlight = false;
	pagefindReady = false;
}

function loadPagefind(): void {
	if (pagefindReady && customElements.get('pagefind-modal-trigger')) {
		mountModalTriggers();
		return;
	}
	if (loadInFlight) return;
	const bundle = bundlePath();
	if (!bundle) return;
	resolvedBundle = bundle;
	loadInFlight = true;

	const cssHref = `${bundle}pagefind-component-ui.css`;
	const jsSrc = `${bundle}pagefind-component-ui.js`;

	if (!document.querySelector(`link[href="${cssHref}"]`)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		document.head.appendChild(link);
	}

	if (customElements.get('pagefind-modal-trigger')) {
		finishLoadSuccess();
		return;
	}

	const existing = document.querySelector(`script[src="${jsSrc}"]`);
	if (existing) {
		const defined = customElements.whenDefined('pagefind-modal-trigger');
		const timeout = new Promise<never>((_, reject) => {
			window.setTimeout(() => reject(new Error('pagefind-ui')), 4000);
		});
		void Promise.race([defined, timeout]).then(finishLoadSuccess).catch(finishLoadFailure);
		return;
	}

	const script = document.createElement('script');
	script.type = 'module';
	script.src = jsSrc;
	script.onload = (): void => {
		const defined = customElements.whenDefined('pagefind-modal-trigger');
		const timeout = new Promise<never>((_, reject) => {
			window.setTimeout(() => reject(new Error('pagefind-ui')), 4000);
		});
		void Promise.race([defined, timeout]).then(finishLoadSuccess).catch(finishLoadFailure);
	};
	script.onerror = finishLoadFailure;
	document.head.appendChild(script);
}

export function startPagefindLoader(explicitBundle?: string): void {
	const bundle = bundlePath(explicitBundle);
	if (bundle) resolvedBundle = bundle;

	if (pagefindReady && customElements.get('pagefind-modal-trigger')) {
		mountModalTriggers();
		return;
	}
	if (!resolvedBundle) return;

	if (!idleScheduled) {
		idleScheduled = true;
		const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
		ric(
			() => {
				loadPagefind();
			},
			{ timeout: 2000 },
		);
	}

	if (pointerBound) return;
	pointerBound = true;
	document.addEventListener(
		'pointerdown',
		(e: PointerEvent) => {
			const el = e.target;
			if (!(el instanceof Element)) return;
			if (el.closest('.pf-search-placeholder, .pf-trigger-stack, [data-pf-trigger-mount]')) {
				loadPagefind();
			}
		},
		true,
	);
}
