<script setup lang="ts">
import { Languages } from 'lucide-vue-next';
import {
	appLocalesForPresentation,
	langSwitcherOptionLabel,
	localeHtmlLang,
	type AppLocale,
} from '../lib/locales';
import type { ShellUi } from '../i18n/types';

defineProps<{
	locale: AppLocale;
	hrefByLocale: Record<AppLocale, string>;
	t: ShellUi;
}>();
</script>

<template>
	<div class="lang-switch" data-lang-switch>
		<div class="hint" data-anchored-floating-hint>
			<button
				type="button"
				class="icon-btn"
				id="lang-switch-btn"
				data-lang-menu-btn
				data-floating-hint-anchor
				aria-expanded="false"
				aria-haspopup="menu"
				aria-controls="lang-switch-panel"
				:aria-label="t.langSwitcherAria"
			>
				<Languages class="lang-switch__icon" :size="18" aria-hidden="true" />
			</button>
			<div class="hint__layer" data-floating-hint-layer role="tooltip">
				<span class="hint__txt">{{ t.langSwitcherHint }}</span>
			</div>
		</div>
		<ul
			class="copy-split__panel lang-switch__panel"
			id="lang-switch-panel"
			role="menu"
			hidden
			:aria-label="t.langSwitcherAria"
		>
			<li v-for="loc in appLocalesForPresentation()" :key="loc" role="presentation">
				<a
					role="menuitem"
					class="copy-split__panel-item lang-switch__panel-item"
					:href="hrefByLocale[loc]"
					:hreflang="localeHtmlLang[loc]"
					:lang="localeHtmlLang[loc]"
					:data-lang-locale="loc"
					:aria-current="locale === loc ? 'page' : undefined"
				>
					<span class="copy-split__panel-item__title">{{ langSwitcherOptionLabel[loc] }}</span>
				</a>
			</li>
		</ul>
	</div>
</template>
