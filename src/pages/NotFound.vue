<script setup lang="ts">
import DocLayout from '../layouts/DocLayout.vue';
import generated from '../generated/docs.json';
import { shellUi } from '../i18n';
import { docHref, type GeneratedDocs } from '../lib/docData';
import { detectLocale } from '../lib/localePreference';
import type { AppLocale } from '../lib/locales';

const data = generated as GeneratedDocs;
const locale: AppLocale = import.meta.env.SSR
	? 'en'
	: detectLocale(window.location.pathname, import.meta.env.BASE_URL);
const t = shellUi(locale);
const nav = data.nav[locale] ?? [];
</script>

<template>
	<DocLayout
		:locale="locale"
		:title="t.shellTitle"
		:description="t.shellDescription"
		:sidebar-groups="nav"
		:breadcrumbs="[{ label: t.crumbLabel }]"
		:headings="[]"
		:home-stem="data.homeStem"
		not-found
	>
		<article class="prose not-found-doc" data-pagefind-ignore>
			<p class="not-found__code" aria-hidden="true">404</p>
			<h1>{{ t.heading }}</h1>
			<p>{{ t.body }}</p>
			<p class="not-found__actions">
				<a class="btn" :href="docHref(locale, data.homeStem)">{{ t.button }}</a>
			</p>
		</article>
	</DocLayout>
</template>
