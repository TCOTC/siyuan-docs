<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { computed, reactive, watch } from 'vue';
import { syncRailScrollEdges } from '../chrome/doc-reading-sync';
import { docHref, type NavGroup } from '../lib/docData';
import { navGroupKeyFromStem } from '../lib/docMeta';
import type { AppLocale } from '../lib/locales';

const props = defineProps<{
	locale: AppLocale;
	idPrefix: string;
	sidebarGroups: NavGroup[];
	railNavAria: string;
	currentStem?: string;
}>();

const currentGroupKey = computed(() =>
	props.currentStem ? navGroupKeyFromStem(props.currentStem) : undefined,
);

/** 各分组开合；随当前文档路径重置，之后以用户点击为准 */
const expandedByKey = reactive<Record<string, boolean>>({});

watch(
	currentGroupKey,
	(current) => {
		for (const group of props.sidebarGroups) {
			expandedByKey[group.key] = group.key === current;
		}
	},
	{ immediate: true },
);

function isExpanded(key: string): boolean {
	return expandedByKey[key] === true;
}

function toggleGroup(key: string): void {
	expandedByKey[key] = !expandedByKey[key];
	requestAnimationFrame(() => syncRailScrollEdges());
}
</script>

<template>
	<nav class="rail-nav" :aria-label="railNavAria">
		<ul class="rail-nav__root">
			<li
				v-for="(group, gi) in sidebarGroups"
				:key="group.key"
				class="rail-nav__section"
				:data-state="isExpanded(group.key) ? 'open' : 'closed'"
			>
				<button
					type="button"
					class="rail-nav__trigger"
					:id="`${idPrefix}-rail-nav-head-${gi}`"
					:aria-expanded="isExpanded(group.key) ? 'true' : 'false'"
					:aria-controls="`${idPrefix}-rail-nav-panel-${gi}`"
					@click="toggleGroup(group.key)"
				>
					<span class="rail-nav__trigger-text">{{ group.label }}</span>
					<ChevronDown class="rail-nav__chev" :size="16" />
				</button>
				<div
					class="rail-nav__panel"
					:id="`${idPrefix}-rail-nav-panel-${gi}`"
					role="region"
					:hidden="!isExpanded(group.key)"
					:aria-labelledby="`${idPrefix}-rail-nav-head-${gi}`"
				>
					<ul class="rail-nav__list">
						<li v-for="item in group.items" :key="item.stem">
							<a
								class="rail-nav__link"
								:class="{ 'is-active': item.stem === currentStem }"
								:href="docHref(locale, item.stem)"
							>
								{{ item.title }}
							</a>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</nav>
</template>
