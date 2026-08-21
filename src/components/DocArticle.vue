<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCodeBlockCopy } from '../composables/useCodeBlockCopy';
import type { AppLocale } from '../lib/locales';

const props = defineProps<{
	locale: AppLocale;
	html: string;
}>();

const articleEl = ref<HTMLElement | null>(null);
useCodeBlockCopy(
	articleEl,
	() => props.locale,
	computed(() => props.html),
);
</script>

<template>
	<article ref="articleEl" class="prose" v-html="html" />
</template>
