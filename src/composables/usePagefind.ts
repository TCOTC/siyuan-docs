import { nextTick, onMounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue';

const TRIGGER = 'pagefind-modal-trigger';

let loadInFlight = false;
let pagefindReady = false;
let resolvedBundle = '';
let resolvedLang = '';
/** 脚本加载失败后隐藏搜索钮；成功前先占位 */
const pagefindAvailable = ref(true);

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

function finishLoadSuccess(): void {
	pagefindReady = true;
	loadInFlight = false;
	pagefindAvailable.value = true;
	void nextTick(() => {
		mountModalTriggers();
	});
}

function finishLoadFailure(): void {
	loadInFlight = false;
	pagefindReady = false;
	pagefindAvailable.value = false;
	removeBundleScript();
}

function loadPagefind(): void {
	if (pagefindReady && customElements.get(TRIGGER)) {
		void nextTick(() => {
			mountModalTriggers();
		});
		return;
	}
	if (loadInFlight || !resolvedBundle) return;
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
		return;
	}

	const existing = document.querySelector(`script[src="${jsSrc}"]`);
	if (existing) {
		if (customElements.get(TRIGGER)) {
			finishLoadSuccess();
			return;
		}
		existing.remove();
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

/** 挂载后加载 Pagefind；失败则隐藏搜索钮。弹层挂在 body，热更新只重挂 trigger */
export function usePagefind(
	bundle: MaybeRefOrGetter<string>,
	lang: MaybeRefOrGetter<string>,
): {
	closePagefindModal: () => void;
	ensurePagefindTriggers: () => void;
	pagefindAvailable: Ref<boolean>;
} {
	onMounted(() => {
		resolvedBundle = toValue(bundle);
		resolvedLang = toValue(lang);
		persistHot();
		loadPagefind();
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
	return { closePagefindModal, ensurePagefindTriggers, pagefindAvailable };
}

if (import.meta.hot) {
	import.meta.hot.accept();
	if (import.meta.hot.data.bundle) {
		resolvedBundle = import.meta.hot.data.bundle;
		resolvedLang = import.meta.hot.data.lang ?? '';
		pagefindReady = Boolean(customElements.get(TRIGGER));
		pagefindAvailable.value = pagefindReady || pagefindAvailable.value;
		void nextTick(() => {
			loadPagefind();
		});
	}
}
