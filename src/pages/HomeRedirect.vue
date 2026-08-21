<script setup lang="ts">
import { useRouter } from 'vue-router';
import { detectLocale } from '../lib/localePreference';
import { docPath } from '../lib/docPath';

const router = useRouter();
if (!import.meta.env.SSR) {
	void router.replace(docPath(detectLocale()));
}
</script>

<template>
	<div aria-busy="true"></div>
</template>
