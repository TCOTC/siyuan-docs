<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import DocArticle from '../components/DocArticle.vue';
import NotFoundArticle from '../components/NotFoundArticle.vue';
import DocLayout from '../layouts/DocLayout.vue';
import generated from '#docs';
import { shellUi } from '../i18n';
import {
	docMarkdownHref,
	findDoc,
	railGroupContaining,
	stemFromRouteParam,
	type GeneratedDocs,
} from '../lib/docData';
import { getDocHtml } from '../lib/docHtml';
import { detectLocale, normalizeLocale } from '../lib/localePreference';
import { defaultLocale, type AppLocale } from '../lib/locales';

const data = generated as GeneratedDocs;
const route = useRoute();

/** 路径里有语言段才算文档页；`/404` 与未匹配路径没有该段 */
const routeLocale = computed(() => normalizeLocale(String(route.params.locale ?? '')));
/** 无语言段时 SSR / 首帧用默认语言，挂载后再按偏好切换，避免 hydration 不一致 */
const detectedLocale = ref<AppLocale | null>(null);
const locale = computed(() => routeLocale.value ?? detectedLocale.value ?? defaultLocale);
const stem = computed(() => stemFromRouteParam(route.params.path));
const doc = computed(() => {
	if (!routeLocale.value) return undefined;
	return findDoc(data.docs, locale.value, stem.value);
});
const html = computed(() => (doc.value ? getDocHtml(doc.value.locale, doc.value.stem) : ''));
const t = computed(() => shellUi(locale.value));
const nav = computed(() => data.nav[locale.value] ?? []);
const breadcrumbs = computed(() => {
	if (!doc.value) return [{ label: t.value.notFoundTitle }];
	const group = railGroupContaining(nav.value, stem.value);
	return [...(group ? [{ label: group.label }] : []), { label: doc.value.title }];
});

onMounted(() => {
	if (!routeLocale.value) detectedLocale.value = detectLocale();
});
</script>

<template>
	<DocLayout
		:locale="locale"
		:title="doc?.title ?? t.notFoundTitle"
		:description="doc ? doc.description : t.notFoundDescription"
		:current-stem="doc?.stem"
		:rail="nav"
		:breadcrumbs="breadcrumbs"
		:headings="doc?.headings ?? []"
		:md-view-href="doc ? docMarkdownHref(locale, doc.stem) : undefined"
		:not-found="!doc"
	>
		<DocArticle v-if="doc" :locale="locale" :html="html" />
		<NotFoundArticle v-else :locale="locale" :t="t" />
	</DocLayout>
</template>
