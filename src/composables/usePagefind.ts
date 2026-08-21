import { onMounted, toValue, type MaybeRefOrGetter } from 'vue';

const TRIGGER = 'pagefind-modal-trigger';

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
		void customElements.whenDefined(TRIGGER).then(finishLoadSuccess);
		return;
	}

	const script = document.createElement('script');
	script.type = 'module';
	script.src = jsSrc;
	script.onload = (): void => {
		void customElements.whenDefined(TRIGGER).then(finishLoadSuccess);
	};
	script.onerror = finishLoadFailure;
	document.head.appendChild(script);
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

/** 挂载后加载 Pagefind；切页时由调用方关闭弹层并补挂 trigger */
export function usePagefind(bundle: MaybeRefOrGetter<string>): {
	closePagefindModal: () => void;
	ensurePagefindTriggers: () => void;
} {
	onMounted(() => {
		resolvedBundle = toValue(bundle);
		loadPagefind();
	});
	return { closePagefindModal, ensurePagefindTriggers };
}
