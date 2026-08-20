<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import NotFoundArticle from '../components/NotFoundArticle.vue';
import DocLayout from '../layouts/DocLayout.vue';
import generated from '#docs';
import { useCodeBlockCopy } from '../composables/useCodeBlockCopy';
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

const data = generated as GeneratedDocs;
const route = useRoute();

const locale = computed(
	() => (normalizeLocale(String(route.params.locale ?? '')) ?? defaultLocale) as AppLocale,
);
const stem = computed(() => stemFromRouteParam(route.params.path));
const doc = computed(() => findDoc(data.docs, locale.value, stem.value));
const t = computed(() => shellUi(locale.value));
const nav = computed(() => data.nav[locale.value] ?? []);
const breadcrumbs = computed(() => {
	if (!doc.value) return [{ label: t.value.crumbLabel }];
	const group = railGroupContaining(nav.value, stem.value);
	return [...(group ? [{ label: group.label }] : []), { label: doc.value.title }];
});

const articleEl = ref<HTMLElement | null>(null);
useCodeBlockCopy(
	articleEl,
	locale,
	computed(() => doc.value?.html ?? ''),
);
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
		:markdown="doc?.markdown"
		:md-view-href="doc ? docMarkdownHref(locale, doc.stem) : undefined"
		:not-found="!doc"
	>
		<article v-if="doc" ref="articleEl" class="prose" v-html="doc.html" />
		<NotFoundArticle v-else :locale="locale" :t="t" />
	</DocLayout>
</template>
