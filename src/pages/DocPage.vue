<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import NotFoundArticle from '../components/NotFoundArticle.vue';
import DocLayout from '../layouts/DocLayout.vue';
import generated from '../generated/docs.json';
import { shellUi } from '../i18n';
import {
	docMarkdownHref,
	findDoc,
	railGroupContaining,
	stemFromRouteParam,
	type GeneratedDocs,
} from '../lib/docData';
import { defaultLocale, type AppLocale } from '../lib/locales';
import { normalizeLocale } from '../lib/localePreference';

type DocPageWindow = Window & { __DOC_PAGE_MARKDOWN__?: string };

const data = generated as GeneratedDocs;
const route = useRoute();
const homeStem = data.homeStem;

const locale = computed(
	() => (normalizeLocale(String(route.params.locale ?? '')) ?? defaultLocale) as AppLocale,
);
const stem = computed(() => stemFromRouteParam(route.params.path));
const doc = computed(() => findDoc(data.docs, locale.value, stem.value));
const t = computed(() => shellUi(locale.value));
const nav = computed(() => data.nav[locale.value] ?? []);
const breadcrumbs = computed(() => {
	if (!doc.value) return [{ label: t.value.crumbLabel }];
	if (stem.value === homeStem) {
		return [{ label: doc.value.title }];
	}
	const group = railGroupContaining(nav.value, stem.value);
	return [...(group ? [{ label: group.label }] : []), { label: doc.value.title }];
});

watch(
	() => doc.value?.markdown ?? '',
	(md) => {
		if (import.meta.env.SSR) return;
		(window as DocPageWindow).__DOC_PAGE_MARKDOWN__ = md;
	},
	{ immediate: true },
);

onUnmounted(() => {
	delete (window as DocPageWindow).__DOC_PAGE_MARKDOWN__;
});
</script>

<template>
	<DocLayout
		:locale="locale"
		:title="doc?.title ?? t.shellTitle"
		:description="doc ? doc.description : t.shellDescription"
		:current-stem="doc?.stem"
		:rail="nav"
		:breadcrumbs="breadcrumbs"
		:headings="doc?.headings ?? []"
		:md-view-href="doc ? docMarkdownHref(locale, doc.stem) : undefined"
		:home-stem="homeStem"
		:not-found="!doc"
	>
		<article v-if="doc" class="prose" v-html="doc.html" />
		<NotFoundArticle v-else :locale="locale" :home-stem="homeStem" :t="t" />
	</DocLayout>
</template>
