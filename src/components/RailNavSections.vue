<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { syncRailScrollEdges } from '../chrome/doc-reading-sync';
import { docPath, railGroupContaining, type RailEntry } from '../lib/docData';
import type { AppLocale } from '../lib/locales';

const props = defineProps<{
	locale: AppLocale;
	idPrefix: string;
	rail: RailEntry[];
	railNavAria: string;
	currentStem?: string;
}>();

const currentGroup = railGroupContaining(props.rail, props.currentStem ?? '');

/** 各分组开合；仅在打开页面时按当前文档路径展开，之后以用户点击为准 */
const expandedByKey = reactive<Record<string, boolean>>({});
for (const entry of props.rail) {
	if (entry.type !== 'group') continue;
	expandedByKey[entry.key] = entry.key === currentGroup?.key;
}

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
						:id="`${idPrefix}-rail-nav-head-${ei}`"
						:aria-expanded="isExpanded(entry.key) ? 'true' : 'false'"
						:aria-controls="`${idPrefix}-rail-nav-panel-${ei}`"
						@click="toggleGroup(entry.key)"
					>
						<span class="rail-nav__trigger-text">{{ entry.label }}</span>
						<ChevronDown class="rail-nav__chev" :size="16" />
					</button>
					<div
						class="rail-nav__panel"
						:id="`${idPrefix}-rail-nav-panel-${ei}`"
						role="region"
						:hidden="!isExpanded(entry.key)"
						:aria-labelledby="`${idPrefix}-rail-nav-head-${ei}`"
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
