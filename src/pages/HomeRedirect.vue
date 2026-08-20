<script setup lang="ts">
import { onMounted } from 'vue';
import { detectRootLocale } from '../lib/localePreference';
import { docHref } from '../lib/docData';
import generated from '../generated/docs.json';
import type { GeneratedDocs } from '../lib/docData';

const data = generated as GeneratedDocs;

onMounted(() => {
	const locale = detectRootLocale();
	window.location.replace(docHref(locale, data.homeStem));
});
</script>

<template>
	<p>Redirecting…</p>
</template>
