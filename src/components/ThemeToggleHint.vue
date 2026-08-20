<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { Sun, Moon } from '@lucide/vue';
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
	<div class="hint" data-anchored-floating-hint>
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
		<div class="hint__layer" data-floating-hint-layer role="tooltip">
			<span class="hint__txt">{{ themeToggleHint }}</span>
		</div>
	</div>
</template>
