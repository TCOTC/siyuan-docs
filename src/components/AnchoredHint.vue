<script setup lang="ts">
import { onUnmounted, ref, useId } from 'vue';

/**
 * 用 CSS 锚点定位把提示贴到包裹层；Teleport 到 body，避免 .rail / .sheet 的 overflow 裁切。
 * 锚点是包裹层本身，Pagefind 替换内部按钮后不必重绑。
 * 仅 (hover: hover) 展示，避免触屏黏滞 hover。
 * 不支持锚点定位时隐藏气泡，按钮仍靠 aria-label。
 */

defineProps<{
	text: string;
}>();

const SHOW_DELAY_MS = 300;
const anchorName = `--hint-${useId().replace(/[^A-Za-z0-9_-]/g, '')}`;
const open = ref(false);
let showTimer: ReturnType<typeof setTimeout> | null = null;

function prefersHover(): boolean {
	return typeof window.matchMedia === 'function' && window.matchMedia('(hover: hover)').matches;
}

function supportsAnchor(): boolean {
	return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('anchor-name', '--x');
}

function canShowHint(): boolean {
	return prefersHover() && supportsAnchor();
}

function clearPending(): void {
	if (showTimer != null) {
		clearTimeout(showTimer);
		showTimer = null;
	}
}

function hide(): void {
	clearPending();
	open.value = false;
}

function onEnter(): void {
	if (!canShowHint()) return;
	clearPending();
	showTimer = setTimeout(() => {
		showTimer = null;
		if (canShowHint()) open.value = true;
	}, SHOW_DELAY_MS);
}

function onPointerUp(e: PointerEvent): void {
	if (e.pointerType !== 'mouse') hide();
}

onUnmounted(() => {
	clearPending();
});
</script>

<template>
	<div
		class="hint"
		:style="{ anchorName }"
		@mouseenter="onEnter"
		@mouseleave="hide"
		@pointerup="onPointerUp"
	>
		<slot />
		<Teleport to="body">
			<div
				class="hint__layer"
				:class="{ 'hint__layer--open': open }"
				:style="{ positionAnchor: anchorName }"
				role="tooltip"
			>
				<span class="hint__txt">{{ text }}</span>
			</div>
		</Teleport>
	</div>
</template>

<style scoped lang="scss">
.hint {
	position: relative;
	display: inline-flex;
	align-items: center;
	overflow: visible;
}

.hint__layer {
	display: none;
}

@supports (anchor-name: --x) {
	.hint__layer {
		position: fixed;
		position-area: bottom;
		justify-self: anchor-center;
		position-try-fallbacks: flip-block, flip-inline;
		inset: auto;
		width: max-content;
		max-width: min(280px, calc(100vw - 24px));
		margin: var(--sp-2);
		padding: var(--sp-2) var(--sp-3);
		display: inline-flex;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		background: var(--raised);
		color: var(--ink);
		border: var(--sp-line) solid var(--line-strong);
		border-radius: var(--r);
		box-shadow: var(--pf-shadow-md, 0 4px 12px rgba(0, 0, 0, 0.25));
		white-space: nowrap;
		text-align: center;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		z-index: 20000;
		transition:
			opacity 0.12s ease,
			visibility 0s linear 0.12s;

		&--open {
			opacity: 1;
			visibility: visible;
			transition:
				opacity 0.12s ease,
				visibility 0s;
		}
	}
}

.hint__txt {
	font-size: var(--tp-xs);
	font-weight: 500;
	line-height: 1.35;
	color: var(--ink);
}
</style>
