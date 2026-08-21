import { nextTick, onMounted, onUnmounted, toValue, watch, type MaybeRefOrGetter } from 'vue';

const TRIGGER = 'pagefind-modal-trigger';
/** 脚本已返回但自定义元素未注册时放弃，避免一直占着 in-flight */
const WHEN_DEFINED_MS = 8000;

let loadInFlight = false;
let pagefindReady = false;
let resolvedBundle = '';
let resolvedLang = '';

const loadWaiters: Array<() => void> = [];

function persistHot(): void {
	if (!import.meta.hot) return;
	import.meta.hot.data.bundle = resolvedBundle;
	import.meta.hot.data.lang = resolvedLang;
}

function bundleScriptSrc(): string {
	return `${resolvedBundle}pagefind-component-ui.js`;
}

function removeBundleScript(): void {
	if (!resolvedBundle) return;
	document.querySelector(`script[src="${bundleScriptSrc()}"]`)?.remove();
}

function flushLoadWaiters(): void {
	const pending = loadWaiters.splice(0, loadWaiters.length);
	for (const resolve of pending) resolve();
}

function waitUntilLoaded(): Promise<void> {
	if (pagefindReady && document.querySelector(TRIGGER)) return Promise.resolve();
	return new Promise((resolve) => {
		loadWaiters.push(resolve);
	});
}

/** 弹层与 config 挂在 body 上，不进 Vue 树，避免热更新拆掉后 Pagefind 单例接不上 */
function ensurePagefindChrome(): void {
	if (import.meta.env.SSR || !resolvedBundle) return;
	let cfg = document.querySelector('pagefind-config');
	if (!cfg) {
		cfg = document.createElement('pagefind-config');
		document.body.appendChild(cfg);
	}
	cfg.setAttribute('bundle-path', resolvedBundle);
	if (resolvedLang) cfg.setAttribute('lang', resolvedLang);

	if (!document.querySelector('pagefind-modal')) {
		const modal = document.createElement('pagefind-modal');
		modal.setAttribute('reset-on-close', '');
		document.body.appendChild(modal);
	}
}

function mountModalTriggers(): void {
	ensurePagefindChrome();
	for (const wrap of document.querySelectorAll('[data-pf-trigger-mount]')) {
		for (const old of wrap.querySelectorAll(TRIGGER)) old.remove();
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

function clickMountedTrigger(): void {
	const host = document.querySelector(TRIGGER);
	if (!host) return;
	const btn = host.querySelector<HTMLElement>('button, .pf-trigger-btn');
	(btn ?? (host as HTMLElement)).click();
}

function finishLoadSuccess(): void {
	pagefindReady = true;
	loadInFlight = false;
	void nextTick(() => {
		mountModalTriggers();
		flushLoadWaiters();
	});
}

function finishLoadFailure(): void {
	if (pagefindReady) return;
	loadInFlight = false;
	removeBundleScript();
	flushLoadWaiters();
}

function loadPagefind(): Promise<void> {
	if (pagefindReady && customElements.get(TRIGGER) && document.querySelector(TRIGGER)) {
		return Promise.resolve();
	}
	if (!resolvedBundle) return Promise.resolve();
	if (loadInFlight) return waitUntilLoaded();
	loadInFlight = true;

	const cssHref = `${resolvedBundle}pagefind-component-ui.css`;
	const jsSrc = bundleScriptSrc();

	if (!document.querySelector(`link[href="${cssHref}"]`)) {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		document.head.appendChild(link);
	}

	if (customElements.get(TRIGGER)) {
		finishLoadSuccess();
		return waitUntilLoaded();
	}

	document.querySelector(`script[src="${jsSrc}"]`)?.remove();

	const script = document.createElement('script');
	script.type = 'module';
	script.src = jsSrc;
	script.onload = (): void => {
		let settled = false;
		const timer = window.setTimeout(() => {
			if (settled) return;
			settled = true;
			finishLoadFailure();
		}, WHEN_DEFINED_MS);
		void customElements.whenDefined(TRIGGER).then(() => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timer);
			finishLoadSuccess();
		});
	};
	script.onerror = finishLoadFailure;
	document.head.appendChild(script);
	return waitUntilLoaded();
}

function isSearchMount(target: EventTarget | null): boolean {
	return target instanceof Element && Boolean(target.closest('[data-pf-trigger-mount]'));
}

/** 热更新或切页后补挂 trigger；脚本未就绪时直接返回 */
export function ensurePagefindTriggers(): void {
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

/** 首次点击搜索钮再加载 Pagefind。弹层挂在 body，热更新只重挂 trigger */
export function usePagefind(
	bundle: MaybeRefOrGetter<string>,
	lang: MaybeRefOrGetter<string>,
): {
	closePagefindModal: () => void;
	ensurePagefindTriggers: () => void;
} {
	let layoutAbort: AbortController | null = null;

	onMounted(() => {
		resolvedBundle = toValue(bundle);
		resolvedLang = toValue(lang);
		persistHot();
		layoutAbort = new AbortController();
		document.addEventListener(
			'click',
			(e: MouseEvent) => {
				if (pagefindReady) return;
				if (!isSearchMount(e.target)) return;
				e.preventDefault();
				e.stopPropagation();
				void loadPagefind().then(() => {
					if (pagefindReady) clickMountedTrigger();
				});
			},
			{ capture: true, signal: layoutAbort.signal },
		);
	});
	onUnmounted(() => {
		layoutAbort?.abort();
		layoutAbort = null;
	});
	watch(
		() => toValue(lang),
		(next) => {
			resolvedLang = next;
			persistHot();
			if (!pagefindReady) return;
			document.querySelector('pagefind-config')?.setAttribute('lang', next);
		},
	);
	return { closePagefindModal, ensurePagefindTriggers };
}

if (import.meta.hot) {
	import.meta.hot.accept();
	if (import.meta.hot.data.bundle) {
		resolvedBundle = import.meta.hot.data.bundle;
		resolvedLang = import.meta.hot.data.lang ?? '';
		pagefindReady = Boolean(customElements.get(TRIGGER));
		if (pagefindReady) {
			void nextTick(() => {
				ensurePagefindTriggers();
			});
		}
	}
}
