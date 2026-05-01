/* 阻塞脚本（勿打包成 ES module）：占位与 Pagefind 宿主分时挂载，避免双按钮。
 * 逻辑变更时请同步检查 Shell 内 `<script src>` 指向本文件。 */
(function () {
	var bundle = document.documentElement.getAttribute('data-pagefind-bundle');
	if (!bundle) return;
	var cssHref = bundle + 'pagefind-component-ui.css';
	var jsSrc = bundle + 'pagefind-component-ui.js';
	var loaded = false;
	var uiReadyMarked = false;
	function markPagefindUiReady() {
		if (uiReadyMarked) return;
		uiReadyMarked = true;
		document.documentElement.setAttribute('data-pagefind-ui-ready', '');
	}
	/** 包加载并注册自定义元素后再插入触发器；占位节点从 DOM 移除，避免与 Pagefind 内按钮并排（hidden 可能被第三方样式覆盖） */
	function mountModalTriggers() {
		document.querySelectorAll('[data-pf-trigger-mount]').forEach(function (wrap) {
			if (wrap.querySelector('pagefind-modal-trigger')) return;
			var ph = wrap.querySelector('.pf-search-placeholder');
			var el = document.createElement('pagefind-modal-trigger');
			el.className = 'pf-trigger-wrap';
			el.setAttribute('compact', '');
			el.setAttribute('placeholder', '');
			el.setAttribute('shortcut', 'mod+k');
			el.setAttribute('hide-shortcut', '');
			wrap.appendChild(el);
			if (ph && ph.parentNode) ph.parentNode.removeChild(ph);
		});
		markPagefindUiReady();
	}
	function loadPagefind() {
		if (loaded) return;
		loaded = true;
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = cssHref;
		document.head.appendChild(link);
		var script = document.createElement('script');
		script.type = 'module';
		script.src = jsSrc;
		script.onload = function () {
			if (typeof customElements !== 'undefined' && customElements.whenDefined) {
				customElements.whenDefined('pagefind-modal-trigger').then(mountModalTriggers).catch(mountModalTriggers);
			} else {
				mountModalTriggers();
			}
		};
		document.head.appendChild(script);
	}
	function scheduleIdle() {
		var ric = window.requestIdleCallback;
		if (typeof ric === 'function') {
			ric(
				function () {
					loadPagefind();
				},
				{ timeout: 2000 },
			);
		} else {
			window.setTimeout(loadPagefind, 300);
		}
	}
	scheduleIdle();
	document.addEventListener(
		'keydown',
		function (e) {
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
		function (e) {
			if (loaded) return;
			var el = e.target;
			if (!el || !el.closest) return;
			if (el.closest('.pf-search-placeholder, .pf-trigger-stack, [data-pf-trigger-mount]')) {
				loadPagefind();
			}
		},
		true,
	);
})();
