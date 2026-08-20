<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { docPath } from '../lib/docData';
import type { AppLocale } from '../lib/locales';
import type { ShellUi } from '../i18n/types';

defineProps<{
	locale: AppLocale;
	t: Pick<ShellUi, 'heading' | 'body' | 'button'>;
}>();
</script>

<template>
	<article class="prose not-found-doc" data-pagefind-ignore>
		<p class="not-found__code" aria-hidden="true">404</p>
		<h1>{{ t.heading }}</h1>
		<p>{{ t.body }}</p>
		<p class="not-found__actions">
			<RouterLink class="btn" :to="docPath(locale)">{{ t.button }}</RouterLink>
		</p>
	</article>
</template>
