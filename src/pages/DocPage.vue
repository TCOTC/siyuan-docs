<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from './NotFound.vue';
import DocLayout from '../layouts/DocLayout.vue';
import generated from '../generated/docs.json';
import { shellUi } from '../i18n';
import { docHref, findDoc, githubBlobUrl, type GeneratedDocs, type TocHeading } from '../lib/docData';
import { navGroupKeyFromStem } from '../lib/docMeta';
import { defaultLocale, type AppLocale } from '../lib/locales';
import { normalizeLocale } from '../lib/localePreference';

const data = generated as GeneratedDocs;
const route = useRoute();

const locale = (normalizeLocale(String(route.params.locale ?? '')) ?? defaultLocale) as AppLocale;
const stem = String(route.params.path ?? '').replace(/\/+$/, '');
const doc = findDoc(data.docs, locale, stem);
const t = shellUi(locale);
const nav = data.nav[locale] ?? [];
const homeStem = data.homeStem;
const groupKey = navGroupKeyFromStem(stem);
const breadcrumbs = [
	{ label: t.navGroup.intro, href: docHref(locale, homeStem) },
	{ label: t.navGroup[groupKey] },
	{ label: doc?.title ?? t.crumbLabel },
];

onMounted(() => {
	(window as Window & { __DOC_PAGE_MARKDOWN__?: string }).__DOC_PAGE_MARKDOWN__ = doc?.markdown ?? '';
});
onUnmounted(() => {
	delete (window as Window & { __DOC_PAGE_MARKDOWN__?: string }).__DOC_PAGE_MARKDOWN__;
});
</script>

<template>
	<DocLayout
		v-if="doc"
		:locale="locale"
		:title="doc.title"
		:description="doc.description"
		:current-stem="doc.stem"
		:sidebar-groups="nav"
		:breadcrumbs="breadcrumbs"
		:headings="(doc.headings as TocHeading[])"
		:md-view-href="githubBlobUrl(doc.sourcePath)"
		:home-stem="homeStem"
	>
		<article v-if="doc" class="prose" v-html="doc.html" />
	</DocLayout>
	<NotFound v-else />
</template>
