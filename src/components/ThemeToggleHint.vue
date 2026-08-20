<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Sun, Moon } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import { bindThemeSync, toggleTheme } from '../lib/theme';

defineProps<{
	themeToggleAria: string;
	themeToggleHint: string;
}>();

let themeAbort: AbortController | null = null;

onMounted(() => {
	themeAbort = new AbortController();
	bindThemeSync(themeAbort.signal);
});

onUnmounted(() => {
	themeAbort?.abort();
	themeAbort = null;
});
</script>

<template>
	<AnchoredHint :text="themeToggleHint">
		<button
			type="button"
			class="icon-btn"
			id="theme-toggle"
			data-floating-hint-anchor
			:aria-label="themeToggleAria"
			@click="toggleTheme"
		>
			<Sun class="theme-icon theme-icon--sun" :size="18" />
			<Moon class="theme-icon theme-icon--moon" :size="18" />
		</button>
	</AnchoredHint>
</template>
