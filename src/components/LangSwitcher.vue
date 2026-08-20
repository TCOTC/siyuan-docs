<script setup lang="ts">
import { Languages } from '@lucide/vue';
import { RouterLink } from 'vue-router';
import AnchoredHint from './AnchoredHint.vue';
import {
	appLocalesForPresentation,
	langSwitcherOptionLabel,
	localeHtmlLang,
	type AppLocale,
} from '../lib/locales';
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
			<button
				type="button"
				class="icon-btn"
				id="lang-switch-btn"
				data-floating-hint-anchor
				:aria-expanded="open ? 'true' : 'false'"
				aria-haspopup="menu"
				aria-controls="lang-switch-panel"
				:aria-label="t.langSwitcherAria"
				@click="emit('toggle')"
			>
				<Languages class="lang-switch__icon" :size="18" aria-hidden="true" />
			</button>
		</AnchoredHint>
		<ul
			class="copy-split__panel lang-switch__panel"
			id="lang-switch-panel"
			role="menu"
			:hidden="!open"
			:class="{ 'is-open': open }"
			:aria-label="t.langSwitcherAria"
		>
			<li v-for="loc in appLocalesForPresentation" :key="loc" role="presentation">
				<RouterLink
					role="menuitem"
					class="copy-split__panel-item lang-switch__panel-item"
					:to="hrefByLocale[loc]"
					:hreflang="localeHtmlLang[loc]"
					:lang="localeHtmlLang[loc]"
					:aria-current="locale === loc ? 'page' : undefined"
					active-class=""
					exact-active-class=""
					@click="onLocaleClick(loc)"
				>
					<span class="copy-split__panel-item__title">{{ langSwitcherOptionLabel[loc] }}</span>
				</RouterLink>
			</li>
		</ul>
	</div>
</template>
