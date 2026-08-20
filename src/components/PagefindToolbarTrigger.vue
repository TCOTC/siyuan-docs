<script setup lang="ts">
defineProps<{
	searchHint: string;
	searchOpenAria: string;
}>();
</script>

<template>
	<div class="hint hint--pf" data-anchored-floating-hint>
		<div class="pf-trigger-stack" data-pf-trigger-mount>
			<button type="button" class="pf-trigger-btn pf-search-placeholder" :aria-label="searchOpenAria">
				<span class="pf-trigger-icon" aria-hidden="true"></span>
			</button>
		</div>
		<div class="hint__layer" data-floating-hint-layer role="tooltip">
			<span class="hint__txt">{{ searchHint }}</span>
		</div>
	</div>
</template>
