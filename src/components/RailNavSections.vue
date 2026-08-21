<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { reactive, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { railGroupContaining, type RailEntry } from '../lib/docData';
import { docPath } from '../lib/docPath';
import type { AppLocale } from '../lib/locales';

const props = defineProps<{
	locale: AppLocale;
	rail: RailEntry[];
	railNavAria: string;
	currentStem?: string;
}>();

const emit = defineEmits<{
	expandChange: [];
}>();

/** 各分组开合。换文档时若当前页所在分组是收起的则展开；不自动收起用户打开的其它分组 */
const expandedByKey = reactive<Record<string, boolean>>({});

function ensureCurrentGroupExpanded(): void {
	const group = railGroupContaining(props.rail, props.currentStem ?? '');
	if (!group || expandedByKey[group.key] === true) return;
	expandedByKey[group.key] = true;
	if (import.meta.env.SSR) return;
	requestAnimationFrame(() => {
		emit('expandChange');
	});
}

watch(
	() => [props.currentStem ?? '', props.rail] as const,
	() => {
		ensureCurrentGroupExpanded();
	},
	{ immediate: true },
);

function isExpanded(key: string): boolean {
	return expandedByKey[key] === true;
}

function toggleGroup(key: string): void {
	expandedByKey[key] = !expandedByKey[key];
	requestAnimationFrame(() => {
		emit('expandChange');
	});
}
</script>

<template>
	<nav class="rail-nav" :aria-label="railNavAria">
		<ul class="rail-nav__root">
			<template v-for="(entry, ei) in rail" :key="entry.type === 'group' ? entry.key : entry.stem">
				<li v-if="entry.type === 'page'" class="rail-nav__home">
					<RouterLink
						class="rail-nav__home-link"
						:class="{ 'is-active': entry.stem === currentStem }"
						:to="docPath(locale, entry.stem)"
						active-class=""
						exact-active-class=""
					>
						{{ entry.title }}
					</RouterLink>
				</li>
				<li
					v-else
					class="rail-nav__section"
					:data-state="isExpanded(entry.key) ? 'open' : 'closed'"
				>
					<button
						type="button"
						class="rail-nav__trigger"
						:id="`rail-nav-head-${ei}`"
						:aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
						:aria-controls="`rail-nav-panel-${ei}`"
						@click="toggleGroup(entry.key)"
					>
						<span class="rail-nav__trigger-text">{{ entry.label }}</span>
						<ChevronDown class="rail-nav__chev" :size="16" />
					</button>
					<div
						class="rail-nav__panel"
						:id="`rail-nav-panel-${ei}`"
						role="region"
						:hidden="!isExpanded(entry.key)"
						:aria-labelledby="`rail-nav-head-${ei}`"
					>
						<ul class="rail-nav__list">
							<li v-for="item in entry.items" :key="item.stem">
								<RouterLink
									class="rail-nav__link"
									:class="{ 'is-active': item.stem === currentStem }"
									:to="docPath(locale, item.stem)"
									active-class=""
									exact-active-class=""
								>
									{{ item.title }}
								</RouterLink>
							</li>
						</ul>
					</div>
				</li>
			</template>
		</ul>
	</nav>
</template>

<style scoped lang="scss">
@mixin nav-label {
	margin: 0;
	padding: var(--sp-2) var(--sp-1) var(--sp-2) var(--sp-micro);
	font-size: var(--tp-body);
	font-weight: 500;
	letter-spacing: 0.01em;
	color: var(--ink-dim);
	border-radius: var(--r);
	line-height: 1.3;
}

.rail-nav {
	&__root {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	&__section {
		margin: 0 0 var(--sp-1);

		&:last-child {
			margin-bottom: 0;
		}

		&[data-state='closed'] .rail-nav__chev {
			transform: rotate(-90deg);
		}
	}

	&__home {
		margin: 0 0 var(--sp-1);
	}

	&__home-link {
		display: block;
		width: 100%;
		@include nav-label;

		&:hover,
		&.is-active {
			color: var(--ink);
		}
	}

	&__trigger {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		font: inherit;
		@include nav-label;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;

		&:hover {
			color: var(--ink);
		}
	}

	&__trigger-text {
		flex: 1;
		min-width: 0;
	}

	&__chev {
		flex-shrink: 0;
		margin-left: var(--sp-2);
		opacity: 0.45;
		transition:
			transform 0.15s ease,
			opacity 0.1s ease;
	}

	&__panel {
		padding: 0 0 var(--sp-micro);

		.rail-nav__list {
			padding-left: var(--sp-3);
		}
	}

	&__list {
		list-style: none;
		margin: 0;
		padding: 0;

		li {
			margin: 0;
		}
	}

	&__link {
		display: block;
		padding: var(--sp-2) var(--sp-2) var(--sp-2) var(--sp-micro);
		margin: 0;
		font-size: var(--tp-sm);
		/* 与 .is-active 统一字重，避免切换当前文档时字宽变化导致列表微抖 */
		font-weight: 500;
		color: var(--ink-dim);
		border-radius: var(--r);
		border: none;
		line-height: 1.45;

		&:hover,
		&.is-active {
			color: var(--ink);
		}
	}
}
</style>
