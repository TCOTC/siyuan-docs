<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
	href?: string;
	to?: string;
	compact?: boolean;
}>();

const attrs = useAttrs();
</script>

<template>
	<li class="menu-panel-item" role="presentation">
		<RouterLink
			v-if="to"
			v-bind="attrs"
			class="menu-panel-item__btn"
			:class="{ 'menu-panel-item__btn--compact': compact }"
			:to="to"
			role="menuitem"
			active-class=""
			exact-active-class=""
		>
			<span class="menu-panel-item__title"><slot /></span>
			<span v-if="$slots.desc" class="menu-panel-item__desc"><slot name="desc" /></span>
		</RouterLink>
		<a
			v-else-if="href"
			v-bind="attrs"
			class="menu-panel-item__btn"
			:class="{ 'menu-panel-item__btn--compact': compact }"
			:href="href"
			role="menuitem"
		>
			<span class="menu-panel-item__title"><slot /></span>
			<span v-if="$slots.desc" class="menu-panel-item__desc"><slot name="desc" /></span>
		</a>
		<button
			v-else
			v-bind="attrs"
			type="button"
			class="menu-panel-item__btn"
			:class="{ 'menu-panel-item__btn--compact': compact }"
			role="menuitem"
		>
			<span class="menu-panel-item__title"><slot /></span>
			<span v-if="$slots.desc" class="menu-panel-item__desc"><slot name="desc" /></span>
		</button>
	</li>
</template>

<style scoped lang="scss">
.menu-panel-item {
	margin: 0;
	padding: 0;
}

.menu-panel-item__btn {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: var(--sp-1);
	width: 100%;
	padding: var(--sp-2) var(--sp-3);
	font-family: inherit;
	font-size: var(--tp-sm);
	font-weight: 510;
	text-align: left;
	color: var(--ink-dim);
	background: transparent;
	border: none;
	border-radius: var(--r);
	cursor: pointer;
	text-decoration: none;

	&:hover {
		background: var(--muted);

		.menu-panel-item__title {
			color: var(--ink);
		}
	}

	&--compact {
		min-height: var(--sp-6);
		justify-content: center;
	}

	&[aria-current='page'] {
		font-weight: 600;
		color: var(--ink);
		background: var(--muted);

		&:hover {
			color: var(--ink);
		}
	}
}

.menu-panel-item__title {
	line-height: 1.25;
}

.menu-panel-item__desc {
	font-size: var(--tp-xs);
	font-weight: 400;
	line-height: 1.35;
	color: var(--ink-faint);
}
</style>
