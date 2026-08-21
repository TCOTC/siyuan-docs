<script setup lang="ts">
import { onMounted } from 'vue';
import AnchoredHint from './AnchoredHint.vue';
import { ensurePagefindTriggers } from '../composables/usePagefind';

defineProps<{
	label: string;
}>();

onMounted(() => {
	ensurePagefindTriggers();
});
</script>

<template>
	<AnchoredHint :text="label">
		<div class="pf-trigger-stack" data-pf-trigger-mount>
			<button type="button" class="pf-trigger-btn pf-search-placeholder" :aria-label="label">
				<span class="pf-trigger-icon" aria-hidden="true"></span>
			</button>
		</div>
	</AnchoredHint>
</template>

<style lang="scss">
/* Pagefind 注入的自定义元素没有 data-v，用非 scoped 覆盖其样式 */
/* 固定槽位 + 绝对叠放：避免 inline-grid 与自定义元素 display 组合在部分浏览器里落成两列并排 */
.pf-trigger-btn {
	cursor: pointer;
	font: inherit;
	color: inherit;
}

.pf-search-placeholder.pf-trigger-btn,
pagefind-modal-trigger.pf-trigger-wrap .pf-trigger-btn {
	position: relative !important;
	display: inline-flex !important;
	width: var(--tool-h) !important;
	height: var(--tool-h) !important;
	min-width: var(--tool-h) !important;
	padding: 0 !important;
	border-radius: var(--r-pill) !important;
	justify-content: center !important;
	align-items: center !important;
	gap: 0 !important;
	overflow: visible !important;
	background: transparent !important;
	border: var(--sp-line) solid var(--line) !important;
	color: var(--ink-dim) !important;
	/* Pagefind UI 默认对 border-color / box-shadow 做过渡，换主题时圆形边框会渐变 */
	transition: none !important;

	&:hover {
		color: var(--ink) !important;
		background: var(--hover-fill) !important;
		border-color: var(--line-strong) !important;
	}
}

pagefind-modal-trigger.pf-trigger-wrap {
	display: block !important;
	position: relative;
	overflow: visible;
	width: 100%;
	height: 100%;
	max-width: 100%;

	.pf-trigger-text {
		position: absolute !important;
		width: var(--sp-line) !important;
		height: var(--sp-line) !important;
		padding: 0 !important;
		margin: calc(var(--sp-line) * -1) !important;
		overflow: hidden !important;
		clip-path: inset(50%) !important;
		white-space: nowrap !important;
		border: 0 !important;
	}

	.pf-trigger-icon {
		width: var(--sp-4) !important;
		height: var(--sp-4) !important;
	}
}

.pf-trigger-stack {
	display: inline-block;
	position: relative;
	width: var(--tool-h);
	height: var(--tool-h);
	vertical-align: middle;

	> * {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		margin: 0;
	}

	/* 占位按钮：与 Pagefind .pf-trigger-icon 同款 mask，避免 Lucide 与 UI 包矢量不一致 */
	.pf-search-placeholder .pf-trigger-icon {
		display: inline-block;
		width: var(--sp-4) !important;
		height: var(--sp-4) !important;
		background: var(--pf-text-muted);
		-webkit-mask-image: var(--pf-icon-search);
		mask-image: var(--pf-icon-search);
		-webkit-mask-size: 100%;
		mask-size: 100%;
		flex-shrink: 0;
	}
}
</style>
