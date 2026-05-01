/**
 * 阻塞脚本（勿改为 ES module）：占位与 Pagefind 宿主分时挂载，避免双按钮。
 * bundle 路径来自 `<meta name="pagefind-bundle">`（含 `pagefind/<npm 版本>/` 前缀，与构建输出一致）。
 */
(function pagefindLoader(): void {
	const meta = document.querySelector('meta[name="pagefind-bundle"]');
	const bundle = meta?.getAttribute('content');
	if (!bundle) return;

	const cssHref = `${bundle}pagefind-component-ui.css`;
	const jsSrc = `${bundle}pagefind-component-ui.js`;
	let loaded = false;
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
			el.setAttribute('shortcut', 'mod+k');
			el.setAttribute('hide-shortcut', '');
			wrap.appendChild(el);
			ph?.parentNode?.removeChild(ph);
		}
		markPagefindUiReady();
	}

	function loadPagefind(): void {
		if (loaded) return;
		loaded = true;
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

	requestIdleCallback(
		() => {
			loadPagefind();
		},
		{ timeout: 2000 },
	);

	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (loaded) return;
			if (e.defaultPrevented) return;
			if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
				loadPagefind();
			}
		},
		true,
	);

	document.addEventListener(
		'pointerdown',
		(e: PointerEvent) => {
			if (loaded) return;
			const el = e.target;
			if (!(el instanceof Element)) return;
			if (el.closest('.pf-search-placeholder, .pf-trigger-stack, [data-pf-trigger-mount]')) {
				loadPagefind();
			}
		},
		true,
	);
})();
