<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import { useTheme } from '../composables/useTheme';

defineProps<{
	themeToggleAria: string;
	themeToggleHint: string;
}>();

const { toggleTheme } = useTheme();
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
