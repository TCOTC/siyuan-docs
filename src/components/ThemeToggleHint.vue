<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue';

defineProps<{
	themeToggleAria: string;
	themeToggleHint: string;
}>();
</script>

<template>
	<div class="hint" data-anchored-floating-hint>
		<button
			type="button"
			class="icon-btn"
			id="theme-toggle"
			data-theme-toggle
			data-floating-hint-anchor
			:aria-label="themeToggleAria"
		>
			<Sun class="theme-icon theme-icon--sun" :size="18" />
			<Moon class="theme-icon theme-icon--moon" :size="18" />
		</button>
		<div class="hint__layer" data-floating-hint-layer role="tooltip">
			<span class="hint__txt">{{ themeToggleHint }}</span>
		</div>
	</div>
</template>
