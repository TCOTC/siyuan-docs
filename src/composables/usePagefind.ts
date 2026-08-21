import { onMounted, toValue, type MaybeRefOrGetter } from 'vue';

const TRIGGER = 'pagefind-modal-trigger';

let idleScheduled = false;
let pointerBound = false;
let loadInFlight = false;
let pagefindReady = false;
let resolvedBundle = '';

function mountModalTriggers(): void {
	for (const wrap of document.querySelectorAll('[data-pf-trigger-mount]')) {
		if (wrap.querySelector(TRIGGER)) continue;
		const ph = wrap.querySelector('.pf-search-placeholder');
		const el = document.createElement(TRIGGER);
		el.className = 'pf-trigger-wrap';
		el.setAttribute('compact', '');
		el.setAttribute('placeholder', '');
		el.setAttribute('shortcut', '__pagefind_no_hotkey__');
		el.setAttribute('hide-shortcut', '');
		wrap.appendChild(el);
		ph?.parentNode?.removeChild(ph);
	}
}

function whenTriggerDefined(): Promise<void> {
	const defined = customElements.whenDefined(TRIGGER);
	const timeout = new Promise<never>((_, reject) => {
		window.setTimeout(() => reject(new Error('pagefind-ui')), 4000);
	});
	return Promise.race([defined, timeout]).then(() => undefined);
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
	if (pagefindReady && customElements.get(TRIGGER)) {
		mountModalTriggers();
		return;
	}
	if (loadInFlight || !resolvedBundle) return;
	loadInFlight = true;

	const cssHref = `${resolvedBundle}pagefind-component-ui.css`;
	const jsSrc = `${resolvedBundle}pagefind-component-ui.js`;

	if (!document.querySelector(`link[href="${cssHref}"]`)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		document.head.appendChild(link);
	}

	if (customElements.get(TRIGGER)) {
		finishLoadSuccess();
		return;
	}

	const existing = document.querySelector(`script[src="${jsSrc}"]`);
	if (existing) {
		void whenTriggerDefined().then(finishLoadSuccess).catch(finishLoadFailure);
		return;
	}

	const script = document.createElement('script');
	script.type = 'module';
	script.src = jsSrc;
	script.onload = (): void => {
		void whenTriggerDefined().then(finishLoadSuccess).catch(finishLoadFailure);
	};
	script.onerror = finishLoadFailure;
	document.head.appendChild(script);
}

function startPagefindLoader(bundle: string): void {
	if (bundle) resolvedBundle = bundle;
	if (!resolvedBundle) return;

	if (pagefindReady && customElements.get(TRIGGER)) {
		mountModalTriggers();
		return;
	}

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

function ensurePagefindTriggers(): void {
	if (!pagefindReady || !customElements.get(TRIGGER)) return;
	mountModalTriggers();
}

function closePagefindModal(): void {
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

/** 挂载后按需加载 Pagefind；切页时由调用方关闭弹层并补挂 trigger */
export function usePagefind(bundle: MaybeRefOrGetter<string>): {
	closePagefindModal: () => void;
	ensurePagefindTriggers: () => void;
} {
	onMounted(() => {
		startPagefindLoader(toValue(bundle));
	});
	return { closePagefindModal, ensurePagefindTriggers };
}
