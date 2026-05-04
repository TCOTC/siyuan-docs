/**
 * 将 [data-anchored-floating-hint] 内提示层在鼠标悬停时改为 position: fixed，
 * 相对锚点（pagefind-modal-trigger 内 .pf-trigger-btn、[data-floating-hint-anchor] 或占位以外的 .pf-trigger-btn）
 * 用 getBoundingClientRect
 * 置于正下方，避免被 overflow 裁切；再根据 getBoundingClientRect 将水平位置钳制在视口内，
 * 底部空间不足且上方放得下时改为显示在按钮上方。
 *
 * 显示时把提示层挂到 document.body：.sheet 带 z-index 会形成堆叠上下文，
 * 否则即使用很高的 z-index，提示仍会绘在侧栏抽屉（如 z-index: 200）之下。
 *
 * 可见性仅由本脚本控制（不用 CSS :hover 显示提示层）：Pagefind 真实按钮出现与 bind 完成
 * 之间若用 CSS 显示，提示会仍留在工具栏内被裁切；悬停后经 SHOW_DELAY_MS 再 portal，与原先 transition-delay 相当。
 *
 * 触屏上 :hover 常为「黏滞」态，且 mouseleave 不可靠。对 (hover: none) 设备不展示气泡，并在 pointerup（非 mouse）时强制收起。
 */
const GAP = 5;
const Z = 20000;
/** 与 .hint__layer 的 max-width: calc(100vw - 24px) 左右留白一致 */
const VIEWPORT_MARGIN = 12;
/** 悬停后延迟再显示，与原先 .hint__layer 上 transition-delay 一致（毫秒） */
const SHOW_DELAY_MS = 300;
/** 挂到 body 后不再处于「锚点控件 :hover」子树内，用此类保持与 CSS 悬停时相同的可见样式 */
const PLACED_OPEN_CLASS = 'js-floating-hint--anchored-open';

const portalAnchor = new WeakMap<Element, { parent: Node; next: ChildNode | null }>();

/** 无可靠悬停（多为触屏为主）：不要用 :hover 展示气泡，避免首次点击后黏滞 hover 导致提示常亮 */
function prefersHover(): boolean {
	return typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;
}

type RootBinding = {
	btn: Element;
	sync: () => void;
	clearPending: () => void;
	onPointerUp: (e: Event) => void;
};
const rootBindings = new WeakMap<Element, RootBinding>();

/**
 * Pagefind 挂载后占位按钮会被移除；若只 bind 一次，mouseenter 永远不会触发。
 * 优先使用已插入的 pagefind-modal-trigger 内按钮；占位 .pf-search-placeholder 不绑提示。
 */
function resolveHintAnchor(root: Element): Element | null {
	return (
		root.querySelector('pagefind-modal-trigger .pf-trigger-btn') ||
		root.querySelector('[data-floating-hint-anchor]') ||
		root.querySelector('.pf-trigger-btn:not(.pf-search-placeholder)')
	);
}

function portalLayerToBody(layer: HTMLElement): void {
	if (layer.parentNode === document.body) return;
	const parent = layer.parentNode;
	if (!parent) return;
	portalAnchor.set(layer, { parent, next: layer.nextSibling });
	document.body.appendChild(layer);
}

function restoreLayerFromBody(layer: HTMLElement): void {
	if (layer.parentNode !== document.body) return;
	const rec = portalAnchor.get(layer);
	portalAnchor.delete(layer);
	if (rec?.parent) {
		rec.parent.insertBefore(layer, rec.next);
	}
}

function setLayerPlacedStyles(layer: HTMLElement): void {
	portalLayerToBody(layer);
	layer.style.setProperty('position', 'fixed', 'important');
	layer.style.setProperty('right', 'auto', 'important');
	layer.style.setProperty('margin', '0', 'important');
	layer.style.setProperty('z-index', String(Z), 'important');
	layer.classList.add(PLACED_OPEN_CLASS);
}

function clearPlacedStyles(layer: HTMLElement): void {
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

function placeToButton(btn: Element, layer: HTMLElement): void {
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

function bindRoot(root: Element): void {
	const btn = resolveHintAnchor(root);
	const layer = (root.querySelector('[data-floating-hint-layer]') ||
		root.querySelector('.pf-trigger-shortcut')) as HTMLElement | null;
	if (!btn || !layer) return;

	const prev = rootBindings.get(root);
	if (prev && prev.btn === btn) return;

	if (prev) {
		prev.clearPending();
		prev.btn.removeEventListener('mouseenter', prev.sync);
		prev.btn.removeEventListener('mouseleave', prev.sync);
		prev.btn.removeEventListener('pointerup', prev.onPointerUp);
		window.removeEventListener('scroll', prev.sync, true);
		window.removeEventListener('resize', prev.sync);
		/* 占位被 Pagefind 替换时若提示曾挂到 body，需收回，否则会残留在最上层 */
		clearPlacedStyles(layer);
	}

	let showTimer: ReturnType<typeof setTimeout> | null = null;

	const clearPending = (): void => {
		if (showTimer != null) {
			clearTimeout(showTimer);
			showTimer = null;
		}
	};

	const onPointerUp = (e: Event): void => {
		/* 触笔 / 手指抬起后强制收起；避免少数设备误报 (hover: hover) 时黏滞 hover */
		const pe = e as PointerEvent;
		if (pe.pointerType !== 'mouse') {
			clearPending();
			clearPlacedStyles(layer);
		}
	};

	const sync = (): void => {
		if (!prefersHover()) {
			clearPending();
			clearPlacedStyles(layer);
			return;
		}
		/* 仅用 :hover，避免点击后 :focus-visible 残留导致提示不随鼠标离开而收起 */
		if (btn instanceof HTMLElement && btn.matches(':hover')) {
			if (layer.classList.contains(PLACED_OPEN_CLASS)) {
				placeToButton(btn, layer);
			} else if (showTimer == null) {
				showTimer = setTimeout(() => {
					showTimer = null;
					if (
						prefersHover() &&
						btn instanceof HTMLElement &&
						btn.matches(':hover')
					) {
						setLayerPlacedStyles(layer);
						placeToButton(btn, layer);
					}
				}, SHOW_DELAY_MS);
			}
		} else {
			clearPending();
			clearPlacedStyles(layer);
		}
	};

	btn.addEventListener('mouseenter', sync);
	btn.addEventListener('mouseleave', sync);
	btn.addEventListener('pointerup', onPointerUp);
	window.addEventListener('scroll', sync, true);
	window.addEventListener('resize', sync);
	rootBindings.set(root, { btn, sync, clearPending, onPointerUp });
}

function run(): void {
	for (const root of document.querySelectorAll('[data-anchored-floating-hint]')) {
		bindRoot(root);
	}
}

function init(): void {
	requestAnimationFrame(run);

	let coalesced = false;
	const scheduleRun = (): void => {
		if (coalesced) return;
		coalesced = true;
		requestAnimationFrame(() => {
			coalesced = false;
			run();
		});
	};

	const mo = new MutationObserver(scheduleRun);
	mo.observe(document.body, { childList: true, subtree: true });
	window.setTimeout(() => mo.disconnect(), 8000);
}

init();
