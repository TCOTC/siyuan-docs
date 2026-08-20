<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detectRootLocale } from '../lib/localePreference';
import generated from '../generated/docs.json';
import { docPath, type GeneratedDocs } from '../lib/docData';

const data = generated as GeneratedDocs;
const router = useRouter();

onMounted(() => {
	const locale = detectRootLocale();
	void router.replace(docPath(locale, data.homeStem));
});
</script>

<template>
	<p>Redirecting…</p>
</template>
