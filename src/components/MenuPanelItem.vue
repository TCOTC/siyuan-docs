<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { RouterLink } from 'vue-router';

defineOptions({ inheritAttrs: false });

const props = defineProps<{
	href?: string;
	to?: string;
	compact?: boolean;
}>();

const attrs = useAttrs();

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'));

const bind = computed(() => {
	if (props.to) {
		return { ...attrs, to: props.to, role: 'menuitem', activeClass: '', exactActiveClass: '' };
	}
	if (props.href) {
		return { ...attrs, href: props.href, role: 'menuitem' };
	}
	return { ...attrs, type: 'button', role: 'menuitem' };
});
</script>

<template>
	<li class="menu-panel-item" role="presentation">
		<component
			:is="tag"
			v-bind="bind"
			class="menu-panel-item__btn"
			:class="{ 'menu-panel-item__btn--compact': compact }"
		>
			<span class="menu-panel-item__title"><slot /></span>
			<span v-if="$slots.desc" class="menu-panel-item__desc"><slot name="desc" /></span>
		</component>
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
		background: var(--hover-fill);

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
	color: var(--ink-dim);
}
</style>
