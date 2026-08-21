<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import IconBtn from './IconBtn.vue';
import { useTheme } from '../composables/useTheme';

defineProps<{
	themeToggleAria: string;
	themeToggleHint: string;
}>();

const { toggleTheme } = useTheme();
</script>

<template>
	<AnchoredHint :text="themeToggleHint">
		<IconBtn id="theme-toggle" :aria-label="themeToggleAria" @click="toggleTheme">
			<Sun class="theme-icon theme-icon--sun" :size="18" />
			<Moon class="theme-icon theme-icon--moon" :size="18" />
		</IconBtn>
	</AnchoredHint>
</template>

<style scoped lang="scss">
.theme-icon--sun,
.theme-icon--moon {
	display: none;
	flex-shrink: 0;
}

html[data-theme='light'] .theme-icon--sun,
html[data-theme='dark'] .theme-icon--moon {
	display: block;
}
</style>
