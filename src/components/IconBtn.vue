<template>
	<button type="button" class="icon-btn">
		<slot />
	</button>
</template>

<style scoped lang="scss">
.icon-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--tool-h);
	height: var(--tool-h);
	padding: 0;
	flex-shrink: 0;
	color: var(--ink-dim);
	background: transparent;
	border: var(--sp-line) solid var(--line);
	border-radius: var(--r-pill);
	cursor: pointer;

	&:hover {
		color: var(--ink);
		background: var(--muted);
		border-color: var(--line-strong);
	}

	html[data-theme='dark'] &:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	&:focus-visible {
		outline: var(--sp-micro) solid var(--accent);
		outline-offset: var(--sp-micro);
	}
}
</style>
