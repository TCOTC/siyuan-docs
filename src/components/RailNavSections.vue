<script setup lang="ts">
import { ChevronDown } from '@lucide/vue';
import { docHref, type NavGroup } from '../lib/docData';
import type { AppLocale } from '../lib/locales';

defineProps<{
	locale: AppLocale;
	idPrefix: string;
	sidebarGroups: NavGroup[];
	railNavAria: string;
	currentStem?: string;
}>();
</script>

<template>
	<nav class="rail-nav" :aria-label="railNavAria">
		<ul class="rail-nav__root">
			<li
				v-for="(group, gi) in sidebarGroups"
				:key="group.key"
				class="rail-nav__section"
				data-state="open"
			>
				<button
					type="button"
					class="rail-nav__trigger"
					:id="`${idPrefix}-rail-nav-head-${gi}`"
					aria-expanded="true"
					:aria-controls="`${idPrefix}-rail-nav-panel-${gi}`"
				>
					<span class="rail-nav__trigger-text">{{ group.label }}</span>
					<ChevronDown class="rail-nav__chev" :size="16" />
				</button>
				<div
					class="rail-nav__panel"
					:id="`${idPrefix}-rail-nav-panel-${gi}`"
					role="region"
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
