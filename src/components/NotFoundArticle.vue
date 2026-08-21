<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { docPath } from '../lib/docPath';
import type { AppLocale } from '../lib/locales';
import type { ShellUi } from '../i18n/types';

defineProps<{
	locale: AppLocale;
	t: Pick<ShellUi, 'notFoundTitle' | 'notFoundBody' | 'notFoundHome'>;
}>();
</script>

<template>
	<article class="prose" data-pagefind-ignore>
		<p class="not-found__code" aria-hidden="true">404</p>
		<h1>{{ t.notFoundTitle }}</h1>
		<p>{{ t.notFoundBody }}</p>
		<p class="not-found__actions">
			<RouterLink class="btn" :to="docPath(locale)">{{ t.notFoundHome }}</RouterLink>
		</p>
	</article>
</template>

<style scoped lang="scss">
.btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: var(--tool-h);
	padding: 0 var(--sp-4);
	font-size: var(--tp-sm);
	font-weight: 600;
	font-family: inherit;
	border: var(--sp-line) solid var(--line);
	border-radius: var(--r-pill);
	background: var(--canvas);
	color: var(--ink);
	cursor: pointer;

	&:hover {
		background: var(--hover-fill);
		text-decoration: none;
	}

	html[data-theme='dark'] & {
		background: var(--muted);
	}
}

.not-found {
	&__code {
		margin: 0 0 var(--sp-2);
		font-size: var(--tp-home-hero);
		font-weight: 600;
		letter-spacing: -0.06em;
		line-height: 1;
		color: var(--ink-dim);
		font-variant-numeric: tabular-nums;
	}

	&__actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--sp-3);
		justify-content: flex-start;
		margin: 0;
	}
}

.not-found__code + h1 {
	margin-top: 0;
}
</style>
