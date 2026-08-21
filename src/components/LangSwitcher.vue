<script setup lang="ts">
import { Languages } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import IconBtn from './IconBtn.vue';
import MenuPanel from './MenuPanel.vue';
import MenuPanelItem from './MenuPanelItem.vue';
import { appI18nLocales, langSwitcherOptionLabel, type AppLocale } from '../lib/locales';
import { persistLocalePreference } from '../lib/localePreference';
import type { ShellUi } from '../i18n/types';

defineProps<{
	locale: AppLocale;
	hrefByLocale: Record<AppLocale, string>;
	t: ShellUi;
	open: boolean;
}>();

const emit = defineEmits<{
	toggle: [];
	close: [];
}>();

function onLocaleClick(loc: AppLocale): void {
	persistLocalePreference(loc);
	emit('close');
}
</script>

<template>
	<div class="lang-switch" data-header-menu="lang">
		<AnchoredHint :text="t.langSwitcherHint">
			<IconBtn
				id="lang-switch-btn"
				:aria-expanded="open ? 'true' : 'false'"
				aria-haspopup="menu"
				aria-controls="lang-switch-panel"
				:aria-label="t.langSwitcherAria"
				@click="emit('toggle')"
			>
				<Languages :size="18" aria-hidden="true" />
			</IconBtn>
		</AnchoredHint>
		<MenuPanel id="lang-switch-panel" :open="open" :aria-label="t.langSwitcherAria">
			<MenuPanelItem
				v-for="loc in appI18nLocales"
				:key="loc"
				compact
				:to="hrefByLocale[loc]"
				:hreflang="loc"
				:lang="loc"
				:aria-current="locale === loc ? 'page' : undefined"
				@click="onLocaleClick(loc)"
			>
				{{ langSwitcherOptionLabel[loc] }}
			</MenuPanelItem>
		</MenuPanel>
	</div>
</template>

<style scoped lang="scss">
.lang-switch {
	position: relative;
	display: inline-flex;
	align-items: center;
	flex-shrink: 0;
}
</style>
