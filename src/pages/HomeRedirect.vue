<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { detectRootLocale } from '../lib/localePreference';
import { docPath } from '../lib/docPath';

const router = useRouter();

onMounted(() => {
	const locale = detectRootLocale();
	void router.replace(docPath(locale));
});
</script>

<template>
	<p>Redirecting…</p>
</template>
