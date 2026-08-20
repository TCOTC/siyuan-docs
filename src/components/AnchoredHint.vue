<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

/**
 * 悬停后把提示层 Teleport 到 body 并 position: fixed，避免被 overflow / .sheet 堆叠上下文裁切。
 * 可见性由本组件控制（不用 CSS :hover）：Pagefind 替换按钮后由 MutationObserver 重绑锚点。
 * 触屏上 :hover 常为黏滞态；对 (hover: none) 不展示气泡，pointerup（非 mouse）时强制收起。
 */

defineProps<{
	text: string;
}>();

const GAP = 5;
const Z = 20000;
/** 与 .hint__layer 的 max-width: calc(100vw - 24px) 左右留白一致 */
const VIEWPORT_MARGIN = 12;
/** 悬停后延迟再显示，与原先 .hint__layer 上 transition-delay 一致（毫秒） */
const SHOW_DELAY_MS = 300;
/** 挂到 body 后不再处于「锚点控件 :hover」子树内，用此类保持与 CSS 悬停时相同的可见样式 */
const PLACED_OPEN_CLASS = 'js-floating-hint--anchored-open';

const rootRef = ref<HTMLElement | null>(null);
const layerRef = ref<HTMLElement | null>(null);
const open = ref(false);

/** 无可靠悬停（多为触屏为主）：不要用 :hover 展示气泡，避免首次点击后黏滞 hover 导致提示常亮 */
function prefersHover(): boolean {
	return typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;
}

/**
 * Pagefind 挂载后占位按钮会被移除；优先使用已插入的 pagefind-modal-trigger 内按钮；
 * 占位 .pf-search-placeholder 不绑提示。
 */
function resolveAnchor(): HTMLElement | null {
	const root = rootRef.value;
	if (!root) return null;
	const el =
		root.querySelector('pagefind-modal-trigger .pf-trigger-btn') ||
		root.querySelector('[data-floating-hint-anchor]') ||
		root.querySelector('.pf-trigger-btn:not(.pf-search-placeholder)');
	return el instanceof HTMLElement ? el : null;
}

let showTimer: ReturnType<typeof setTimeout> | null = null;
let anchor: HTMLElement | null = null;
let observer: MutationObserver | null = null;

function clearPending(): void {
	if (showTimer != null) {
		clearTimeout(showTimer);
		showTimer = null;
	}
}

function clearPlacedStyles(): void {
	const layer = layerRef.value;
	if (!layer) return;
	layer.classList.remove(PLACED_OPEN_CLASS);
	layer.style.removeProperty('position');
	layer.style.removeProperty('left');
	layer.style.removeProperty('top');
	layer.style.removeProperty('right');
	layer.style.removeProperty('transform');
	layer.style.removeProperty('z-index');
	layer.style.removeProperty('margin');
}

function setLayerPlacedStyles(): void {
	const layer = layerRef.value;
	if (!layer) return;
	layer.style.setProperty('position', 'fixed', 'important');
	layer.style.setProperty('right', 'auto', 'important');
	layer.style.setProperty('margin', '0', 'important');
	layer.style.setProperty('z-index', String(Z), 'important');
	layer.classList.add(PLACED_OPEN_CLASS);
}

function placeToButton(): void {
	const btn = anchor;
	const layer = layerRef.value;
	if (!btn || !layer) return;
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

function hide(): void {
	clearPending();
	open.value = false;
	clearPlacedStyles();
}

async function show(): Promise<void> {
	if (!prefersHover() || !anchor) return;
	open.value = true;
	await nextTick();
	setLayerPlacedStyles();
	placeToButton();
}

function sync(): void {
	if (!prefersHover()) {
		hide();
		return;
	}
	/* 仅用 :hover，避免点击后 :focus-visible 残留导致提示不随鼠标离开而收起 */
	if (anchor?.matches(':hover')) {
		if (open.value) {
			placeToButton();
		} else if (showTimer == null) {
			showTimer = setTimeout(() => {
				showTimer = null;
				if (prefersHover() && anchor?.matches(':hover')) {
					void show();
				}
			}, SHOW_DELAY_MS);
		}
	} else {
		hide();
	}
}

function onPointerUp(e: Event): void {
	/* 触笔 / 手指抬起后强制收起；避免少数设备误报 (hover: hover) 时黏滞 hover */
	const pe = e as PointerEvent;
	if (pe.pointerType !== 'mouse') hide();
}

function unbindAnchor(): void {
	if (!anchor) return;
	anchor.removeEventListener('mouseenter', sync);
	anchor.removeEventListener('mouseleave', sync);
	anchor.removeEventListener('pointerup', onPointerUp);
	hide();
	anchor = null;
}

function bindAnchor(): void {
	const next = resolveAnchor();
	if (next === anchor) return;
	unbindAnchor();
	anchor = next;
	if (!anchor) return;
	anchor.addEventListener('mouseenter', sync);
	anchor.addEventListener('mouseleave', sync);
	anchor.addEventListener('pointerup', onPointerUp);
}

onMounted(() => {
	bindAnchor();
	window.addEventListener('scroll', sync, true);
	window.addEventListener('resize', sync);
	const root = rootRef.value;
	if (root) {
		observer = new MutationObserver(() => {
			bindAnchor();
		});
		observer.observe(root, { childList: true, subtree: true });
	}
});

onUnmounted(() => {
	observer?.disconnect();
	observer = null;
	window.removeEventListener('scroll', sync, true);
	window.removeEventListener('resize', sync);
	unbindAnchor();
});
</script>

<template>
	<div ref="rootRef" class="hint">
		<slot />
		<Teleport to="body" :disabled="!open">
			<div ref="layerRef" class="hint__layer" role="tooltip">
				<span class="hint__txt">{{ text }}</span>
			</div>
		</Teleport>
	</div>
</template>
