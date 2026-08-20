<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';
import BrandLogo from '../components/BrandLogo.vue';
import CopyPageMarkdownToolbar from '../components/CopyPageMarkdownToolbar.vue';
import LangSwitcher from '../components/LangSwitcher.vue';
import PagefindToolbarTrigger from '../components/PagefindToolbarTrigger.vue';
import RailNavSections from '../components/RailNavSections.vue';
import ThemeToggleHint from '../components/ThemeToggleHint.vue';
import { closePagefindModal, startPagefindLoader } from '../chrome/pagefind-loader';
import { closeDocRailIfOpen } from '../chrome/shell-ui/doc-rail-drawer';
import { mountDocChrome, syncDocChromeAfterNavigation, unmountDocChrome } from '../chrome/shell-ui';
import { shellUi } from '../i18n';
import { docHref, docPath, findDoc, type GeneratedDocs, type RailEntry, type TocHeading } from '../lib/docData';
import { appI18nLocales, localeHtmlLang, type AppLocale } from '../lib/locales';
import generated from '../generated/docs.json';

const docsData = generated as GeneratedDocs;

const props = defineProps<{
	locale: AppLocale;
	title: string;
	description?: string;
	currentStem?: string;
	rail: RailEntry[];
	breadcrumbs: { label: string; href?: string }[];
	headings: TocHeading[];
	mdViewHref?: string;
	homeStem: string;
	notFound?: boolean;
}>();

function localeDocStem(locale: AppLocale, stem: string, homeStem: string): string {
	return findDoc(docsData.docs, locale, stem) ? stem : homeStem;
}

function localeDocHref(locale: AppLocale, stem: string, homeStem: string): string {
	return docHref(locale, localeDocStem(locale, stem, homeStem));
}

function localeDocPath(locale: AppLocale, stem: string, homeStem: string): string {
	return docPath(locale, localeDocStem(locale, stem, homeStem));
}

const t = computed(() => shellUi(props.locale));
const tocItems = computed(() => props.headings.filter((h) => h.depth >= 2 && h.depth <= 4));
const docHomePath = computed(() => docPath(props.locale, props.homeStem));
const hrefByLocale = computed(() => {
	const stem = props.currentStem ?? props.homeStem;
	return Object.fromEntries(
		appI18nLocales.map((l) => [l, localeDocPath(l, stem, props.homeStem)] as const),
	) as Record<AppLocale, string>;
});
const pagefindBundle = computed(() => {
	const base = import.meta.env.BASE_URL;
	return `${base.endsWith('/') ? base : `${base}/`}pagefind/`;
});
const siteTitle = computed(() =>
	props.title === t.value.siteName ? props.title : `${props.title} – ${t.value.siteName}`,
);

useHead({
	htmlAttrs: () => ({
		lang: localeHtmlLang[props.locale],
		'data-doc-locale': props.locale,
	}),
	bodyAttrs: {
		class: 'doc-layout',
	},
	title: () => siteTitle.value,
	meta: () => [
		{ name: 'pagefind-bundle', content: pagefindBundle.value },
		...(props.description ? [{ name: 'description', content: props.description }] : []),
	],
	link: () => [
		{ rel: 'icon', type: 'image/svg+xml', href: `${import.meta.env.BASE_URL}favicon.svg` },
		{ rel: 'icon', href: `${import.meta.env.BASE_URL}favicon.ico`, sizes: 'any' },
		...appI18nLocales.map((loc) => ({
			rel: 'alternate',
			hreflang: localeHtmlLang[loc],
			href: localeDocHref(loc, props.currentStem ?? props.homeStem, props.homeStem),
		})),
	],
});

onMounted(() => {
	mountDocChrome();
	startPagefindLoader();
});

onUnmounted(() => {
	unmountDocChrome();
});

watch(
	() => [props.locale, props.currentStem ?? '', props.notFound === true] as const,
	async () => {
		if (import.meta.env.SSR) return;
		await nextTick();
		closePagefindModal();
		closeDocRailIfOpen();
		syncDocChromeAfterNavigation();
		const main = document.getElementById('main-content');
		if (main instanceof HTMLElement) {
			main.focus({ preventScroll: true });
		}
	},
);
</script>

<template>
	<a class="skip-link" href="#main-content">{{ t.skipToContent }}</a>
	<pagefind-config :bundle-path="pagefindBundle" :lang="locale" />
	<div class="shell">
		<div class="rail-backdrop" id="rail-backdrop" aria-hidden="true" />
		<aside class="rail" id="doc-rail" :aria-label="t.docNavAria" data-pagefind-ignore>
			<header class="rail-header">
				<RouterLink
					class="brand-lockup brand-lockup--rail"
					:to="docHomePath"
					active-class=""
					exact-active-class=""
				>
					<BrandLogo />
					<span class="brand-lockup__divider" aria-hidden="true" />
					<span class="brand-lockup__text">{{ t.railSiteLabel }}</span>
				</RouterLink>
				<div id="tool-slot-rail" class="tool-slot tool-slot--rail"></div>
				<div class="rail-header__actions">
					<div class="rail-header__search-slot">
						<PagefindToolbarTrigger :search-hint="t.searchHint" :search-open-aria="t.searchOpenAria" />
					</div>
				</div>
			</header>
			<div class="rail-body">
				<div class="rail-scroll-clip" data-rail-scroll-clip data-edge-top="0" data-edge-bottom="1">
					<div class="rail-scroll">
						<RailNavSections
							:locale="locale"
							id-prefix="doc"
							:rail="rail"
							:rail-nav-aria="t.railNavAria"
							:current-stem="currentStem"
						/>
					</div>
					<div class="rail-scroll__edge rail-scroll__edge--top" aria-hidden="true" />
					<div class="rail-scroll__edge rail-scroll__edge--bottom" aria-hidden="true" />
				</div>
				<div class="rail-footer">
					<ul class="rail-footer__links">
						<li>
							<RouterLink
								:class="{ 'is-current': currentStem === homeStem }"
								:to="docHomePath"
								active-class=""
								exact-active-class=""
							>
								{{ t.railFooterDocs }}
							</RouterLink>
						</li>
						<li>
							<a href="https://github.com/siyuan-note/bazaar" target="_blank" rel="noopener noreferrer">{{
								t.railFooterBazaar
							}}</a>
						</li>
						<li>
							<a href="https://b3log.org/siyuan" target="_blank" rel="noopener noreferrer">{{
								t.railFooterOfficial
							}}</a>
						</li>
					</ul>
				</div>
			</div>
		</aside>

		<div class="sheet" :data-doc-has-toc="tocItems.length > 0 ? '1' : undefined">
			<div class="bar" data-pagefind-ignore>
				<nav v-if="breadcrumbs.length" class="breadcrumbs" :aria-label="t.breadcrumbsAria">
					<ol class="breadcrumbs__list">
						<li v-for="(c, i) in breadcrumbs" :key="i" class="breadcrumbs__item">
							<RouterLink
								v-if="c.href && i !== breadcrumbs.length - 1"
								class="breadcrumbs__link"
								:to="c.href"
								active-class=""
								exact-active-class=""
							>
								{{ c.label }}
							</RouterLink>
							<a
								v-else-if="c.href"
								class="breadcrumbs__link"
								:class="{ breadcrumbs__current: i === breadcrumbs.length - 1 }"
								:href="c.href"
								:aria-current="i === breadcrumbs.length - 1 ? 'page' : undefined"
							>
								{{ c.label }}
							</a>
							<span
								v-else-if="i === breadcrumbs.length - 1"
								class="breadcrumbs__current"
								aria-current="page"
							>
								{{ c.label }}
							</span>
							<span v-else class="breadcrumbs__text">{{ c.label }}</span>
						</li>
					</ol>
				</nav>
				<div class="bar__act">
					<div id="tool-slot-bar" class="tool-slot tool-slot--bar">
						<div id="tool-float" class="tool-float">
							<div class="bar__search bar__search--drawer" data-pagefind-ignore>
								<PagefindToolbarTrigger :search-hint="t.searchHint" :search-open-aria="t.searchOpenAria" />
							</div>
							<LangSwitcher :locale="locale" :href-by-locale="hrefByLocale" :t="t" />
							<div class="bar__desk">
								<ThemeToggleHint :theme-toggle-aria="t.themeToggleAria" :theme-toggle-hint="t.themeToggleHint" />
								<CopyPageMarkdownToolbar v-if="!notFound && mdViewHref" :md-view-href="mdViewHref" :t="t" />
							</div>
						</div>
					</div>
					<button
						type="button"
						class="rail-menu-trigger"
						id="rail-menu-toggle"
						aria-expanded="false"
						aria-controls="doc-rail"
						:aria-label="t.railMenuOpenAria"
						:data-aria-when-open="t.railMenuCloseAria"
						:data-aria-when-closed="t.railMenuOpenAria"
					>
						<span class="rail-menu-trigger__icon" aria-hidden="true">
							<span class="rail-menu-trigger__bar"></span>
							<span class="rail-menu-trigger__bar"></span>
							<span class="rail-menu-trigger__bar"></span>
						</span>
					</button>
				</div>
			</div>
			<div class="read" :class="{ 'read--toc': tocItems.length > 0 }">
				<div class="read-cluster">
					<main id="main-content" class="read-main" tabindex="-1" data-pagefind-body>
						<slot />
					</main>
					<aside v-show="tocItems.length > 0" class="toc" :aria-label="t.tocAsideAria" data-pagefind-ignore>
						<div class="toc__inner">
							<ul class="toc__list" id="doc-toc-list" style="--top: 0px; --height: 0px">
								<li v-for="h in tocItems" :key="h.slug" :class="`toc-depth-${h.depth}`">
									<a :href="`#${h.slug}`">{{ h.text }}</a>
								</li>
							</ul>
						</div>
					</aside>
				</div>
			</div>
		</div>
	</div>
	<pagefind-modal reset-on-close></pagefind-modal>
</template>
