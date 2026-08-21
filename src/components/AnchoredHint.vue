<script setup lang="ts">
defineProps<{
	text: string;
}>();
</script>

<template>
	<span class="hint">
		<slot />
		<span class="hint__txt" role="tooltip">{{ text }}</span>
	</span>
</template>

<style scoped lang="scss">
.hint {
	position: relative;
	display: inline-flex;
	align-items: center;
	overflow: visible;
}

.hint__txt {
	display: none;
}

/* 仅精细指针显示；触屏不弹出，避免黏滞 hover。延时用 transition-delay，无脚本。 */
@media (hover: hover) {
	.hint__txt {
		position: absolute;
		top: calc(100% + var(--sp-2));
		right: 0;
		left: auto;
		z-index: 20000;
		display: block;
		width: max-content;
		max-width: min(280px, calc(100vw - var(--sp-5)));
		padding: var(--sp-2) var(--sp-3);
		background: var(--raised);
		color: var(--ink);
		border: var(--sp-line) solid var(--line-strong);
		border-radius: var(--r);
		box-shadow: var(--pf-shadow-md);
		white-space: nowrap;
		text-align: center;
		font-size: var(--tp-xs);
		font-weight: 500;
		line-height: 1.35;
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
		transition:
			opacity 0.12s ease,
			visibility 0s linear 0.12s;
	}

	.hint:hover .hint__txt {
		opacity: 1;
		visibility: visible;
		transition-delay: 0.3s;
	}
}
</style>
