<script setup lang="ts">
import AnchoredHint from './AnchoredHint.vue';

defineProps<{
	searchHint: string;
	searchOpenAria: string;
}>();
</script>

<template>
	<AnchoredHint class="hint--pf" :text="searchHint">
		<div class="pf-trigger-stack" data-pf-trigger-mount v-once>
			<button type="button" class="pf-trigger-btn pf-search-placeholder" :aria-label="searchOpenAria">
				<span class="pf-trigger-icon" aria-hidden="true"></span>
			</button>
		</div>
	</AnchoredHint>
</template>
