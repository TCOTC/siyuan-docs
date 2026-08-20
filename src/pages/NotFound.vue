<script setup lang="ts">
import NotFoundArticle from '../components/NotFoundArticle.vue';
import DocLayout from '../layouts/DocLayout.vue';
import generated from '#docs';
import { shellUi } from '../i18n';
import type { GeneratedDocs } from '../lib/docData';
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
		:rail="nav"
		:breadcrumbs="[{ label: t.crumbLabel }]"
		:headings="[]"
		:home-stem="data.homeStem"
		not-found
	>
		<NotFoundArticle :locale="locale" :home-stem="data.homeStem" :t="t" />
	</DocLayout>
</template>
