/**
 * 将 [data-anchored-floating-hint] 内提示层在鼠标悬停时改为 position: fixed，
 * 相对锚点（[data-floating-hint-anchor] 或 .pf-trigger-btn）用 getBoundingClientRect
 * 置于正下方，避免被 overflow 裁切；再根据 getBoundingClientRect 将水平位置钳制在视口内，
 * 底部空间不足且上方放得下时改为显示在按钮上方。
 *
 * 显示时把提示层挂到 document.body：.doc-center 带 z-index 会形成堆叠上下文，
 * 否则即使用很高的 z-index，提示仍会绘在侧栏抽屉（如 z-index: 200）之下。
 */
const GAP = 5;
const Z = 20000;
/** 与 .u-floating-hint__layer 的 max-width: calc(100vw - 24px) 左右留白一致 */
const VIEWPORT_MARGIN = 12;
/** 挂到 body 后不再处于「锚点控件 :hover」子树内，用此类保持与 CSS 悬停时相同的可见样式 */
const PLACED_OPEN_CLASS = 'js-floating-hint--anchored-open';

/** @type {WeakMap<Element, { parent: Node; next: ChildNode | null }>} */
const portalAnchor = new WeakMap();

function portalLayerToBody(layer) {
	if (layer.parentNode === document.body) return;
	const parent = layer.parentNode;
	if (!parent) return;
	portalAnchor.set(layer, { parent, next: layer.nextSibling });
	document.body.appendChild(layer);
}

function restoreLayerFromBody(layer) {
	if (layer.parentNode !== document.body) return;
	const rec = portalAnchor.get(layer);
	portalAnchor.delete(layer);
	if (rec?.parent) {
		rec.parent.insertBefore(layer, rec.next);
	}
}

function setLayerPlacedStyles(layer) {
	portalLayerToBody(layer);
	layer.style.setProperty('position', 'fixed', 'important');
	layer.style.setProperty('right', 'auto', 'important');
	layer.style.setProperty('margin', '0', 'important');
	layer.style.setProperty('z-index', String(Z), 'important');
	layer.classList.add(PLACED_OPEN_CLASS);
}

function clearPlacedStyles(layer) {
	layer.classList.remove(PLACED_OPEN_CLASS);
	layer.style.removeProperty('position');
	layer.style.removeProperty('left');
	layer.style.removeProperty('top');
	layer.style.removeProperty('right');
	layer.style.removeProperty('transform');
	layer.style.removeProperty('z-index');
	layer.style.removeProperty('margin');
	restoreLayerFromBody(layer);
}

function placeToButton(btn, layer) {
	const r = btn.getBoundingClientRect();
	let cx = r.left + r.width / 2;
	let top = r.bottom + GAP;
	/* left 为视口 X，与 translateX(-50%) 配合使气泡水平中心对齐该 X */
	layer.style.setProperty('left', `${Math.round(cx * 10) / 10}px`, 'important');
	layer.style.setProperty('top', `${Math.round(top * 10) / 10}px`, 'important');
	layer.style.setProperty('transform', 'translateX(-50%) translateY(0)', 'important');

	const rect = layer.getBoundingClientRect();
	const halfW = rect.width / 2;
	const minCx = VIEWPORT_MARGIN + halfW;
	const maxCx = window.innerWidth - VIEWPORT_MARGIN - halfW;
	if (minCx <= maxCx) {
		cx = Math.min(maxCx, Math.max(minCx, cx));
	} else {
		cx = window.innerWidth / 2;
	}
	layer.style.setProperty('left', `${Math.round(cx * 10) / 10}px`, 'important');

	if (rect.bottom > window.innerHeight - VIEWPORT_MARGIN) {
		const above = r.top - GAP - rect.height;
		if (above >= VIEWPORT_MARGIN) {
			top = above;
			layer.style.setProperty('top', `${Math.round(top * 10) / 10}px`, 'important');
		}
	}
}

function labelSearchHintModKeys() {
	const nav = typeof navigator !== 'undefined' ? navigator : null;
	const apple =
		nav?.userAgentData?.platform === 'macOS' ||
		(nav != null && /iPhone|iPad|iPod|Macintosh/.test(nav.userAgent));
	const label = apple ? '⌘' : 'Ctrl';
	for (const el of document.querySelectorAll('[data-search-hint-mod]')) {
		el.textContent = label;
	}
}

function bindRoot(root) {
	if (root.hasAttribute('data-anchored-bound')) return;
	const btn =
		root.querySelector('[data-floating-hint-anchor]') || root.querySelector('.pf-trigger-btn');
	const layer =
		root.querySelector('[data-floating-hint-layer]') || root.querySelector('.pf-trigger-shortcut');
	if (!btn || !layer) return;
	root.setAttribute('data-anchored-bound', '1');

	const sync = () => {
		/* 仅用 :hover，避免点击后 :focus-visible 残留导致提示不随鼠标离开而收起 */
		if (btn.matches && btn.matches(':hover')) {
			setLayerPlacedStyles(layer);
			placeToButton(btn, layer);
		} else {
			clearPlacedStyles(layer);
		}
	};

	btn.addEventListener('mouseenter', sync);
	btn.addEventListener('mouseleave', sync);
	window.addEventListener('scroll', sync, true);
	window.addEventListener('resize', sync);
}

function run() {
	labelSearchHintModKeys();
	for (const root of document.querySelectorAll('[data-anchored-floating-hint]')) {
		bindRoot(root);
	}
}

function init() {
	requestAnimationFrame(run);

	let tries = 0;
	const id = setInterval(() => {
		run();
		tries += 1;
		if (tries > 30) clearInterval(id);
	}, 150);
}

init();
