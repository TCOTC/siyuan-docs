<script setup lang="ts">
defineProps<{
	open: boolean;
}>();
</script>

<template>
	<ul class="menu-panel" role="menu" :hidden="!open" :class="{ 'is-open': open }">
		<slot />
	</ul>
</template>

<style scoped lang="scss">
.menu-panel {
	position: absolute;
	right: 0;
	top: calc(100% + var(--sp-2));
	min-width: var(--sp-12);
	padding: var(--sp-2);
	margin: 0;
	list-style: none;
	background: var(--raised);
	border: var(--sp-line) solid var(--line-strong);
	border-radius: var(--r-card);
	box-shadow: var(--pf-shadow-lg);
	opacity: 0;
	visibility: hidden;
	transform: translateY(calc(var(--sp-1) * -1));
	transition:
		opacity 0.12s ease,
		transform 0.12s ease,
		visibility 0s linear 0.12s;
	z-index: 55;

	&.is-open {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
		transition-delay: 0s;
	}
}
</style>
