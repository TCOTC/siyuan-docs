<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useHead } from '@unhead/vue';
import BrandLogo from '../components/BrandLogo.vue';
import CopyPageMarkdownToolbar from '../components/CopyPageMarkdownToolbar.vue';
import LangSwitcher from '../components/LangSwitcher.vue';
import PagefindToolbarTrigger from '../components/PagefindToolbarTrigger.vue';
import RailNavSections from '../components/RailNavSections.vue';
import ThemeToggleHint from '../components/ThemeToggleHint.vue';
import { useMediaQuery } from '../composables/useMediaQuery';
import { usePagefind } from '../composables/usePagefind';
import { useRailScroll } from '../composables/useRailScroll';
import { useTocInPage } from '../composables/useTocInPage';
import { shellUi } from '../i18n';
import { docHref, findDoc, type GeneratedDocs, type RailEntry, type TocHeading } from '../lib/docData';
import { HOME_STEM, docPath } from '../lib/docPath';
import { appI18nLocales, localeHtmlLang, type AppLocale } from '../lib/locales';
import generated from '#docs';

const docsData = generated as GeneratedDocs;

const props = defineProps<{
	locale: AppLocale;
	title: string;
	description?: string;
	currentStem?: string;
	rail: RailEntry[];
	breadcrumbs: { label: string; href?: string }[];
	headings: TocHeading[];
	markdown?: string;
	mdViewHref?: string;
	notFound?: boolean;
}>();

function localeDocStem(locale: AppLocale, stem: string): string {
	return findDoc(docsData.docs, locale, stem) ? stem : HOME_STEM;
}

function localeDocHref(locale: AppLocale, stem: string): string {
	return docHref(locale, localeDocStem(locale, stem));
}

function localeDocPath(locale: AppLocale, stem: string): string {
	return docPath(locale, localeDocStem(locale, stem));
}

const t = computed(() => shellUi(props.locale));
const tocItems = computed(() => props.headings.filter((h) => h.depth >= 2 && h.depth <= 4));
const docHomePath = computed(() => docPath(props.locale));
const hrefByLocale = computed(() => {
	const stem = props.currentStem ?? HOME_STEM;
	return Object.fromEntries(
		appI18nLocales.map((l) => [l, localeDocPath(l, stem)] as const),
	) as Record<AppLocale, string>;
});
const pagefindBundle = computed(() => {
	const base = import.meta.env.BASE_URL;
	return `${base.endsWith('/') ? base : `${base}/`}pagefind/`;
});
const siteTitle = computed(() =>
	props.title === t.value.siteName ? props.title : `${props.title} – ${t.value.siteName}`,
);

type HeaderMenu = 'lang' | 'copy' | null;
const headerMenu = ref<HeaderMenu>(null);
const railOpen = ref(false);
const slotRail = ref<HTMLElement | null>(null);
const railScrollEl = ref<HTMLElement | null>(null);
const railScrollClip = ref<HTMLElement | null>(null);
const railAside = ref<HTMLElement | null>(null);
const tocListEl = ref<HTMLElement | null>(null);
const mainEl = ref<HTMLElement | null>(null);
const toolbarWide = useMediaQuery('(min-width: 750px)', true);
const desktopRail = useMediaQuery('(width >= 850px)', true);
const { syncRailScrollEdges, scrollActiveRailNavIntoView } = useRailScroll(
	railScrollEl,
	railScrollClip,
	railAside,
);
const { tocSync, scheduleTocSyncSoon, resetTocSyncState } = useTocInPage(tocListEl, mainEl);
const { closePagefindModal, ensurePagefindTriggers } = usePagefind(pagefindBundle);
let layoutAbort: AbortController | null = null;

function toggleHeaderMenu(name: Exclude<HeaderMenu, null>): void {
	headerMenu.value = headerMenu.value === name ? null : name;
}

function closeHeaderMenu(): void {
	headerMenu.value = null;
}

function setRailOpen(open: boolean): void {
	if (railOpen.value === open) return;
	railOpen.value = open;
}

function onRailClick(e: MouseEvent): void {
	const t = e.target;
	if (t instanceof Element && t.closest('a[href]')) {
		setRailOpen(false);
	}
}

function onBreadcrumbsClick(e: MouseEvent): void {
	if (e.defaultPrevented || e.button !== 0) return;
	if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
	const t = e.target;
	if (!(t instanceof Element)) return;
	const hit = t.closest('a.breadcrumbs__current, span.breadcrumbs__current');
	if (!hit) return;
	let sameDoc = hit instanceof HTMLSpanElement;
	if (hit instanceof HTMLAnchorElement) {
		try {
			const u = new URL(hit.getAttribute('href') ?? '', location.href);
			sameDoc = u.pathname === location.pathname && u.search === location.search;
		} catch {
			sameDoc = false;
		}
	}
	if (!sameDoc) return;
	if (hit instanceof HTMLAnchorElement) e.preventDefault();
	try {
		if (location.hash) {
			history.replaceState(null, '', location.pathname + location.search);
		}
	} catch {
		/* ignore */
	}
	window.scrollTo({ top: 0, behavior: 'smooth' });
	scheduleTocSyncSoon();
}

useHead({
	htmlAttrs: {
		lang: () => localeHtmlLang[props.locale],
		'data-doc-locale': () => props.locale,
	},
	bodyAttrs: {
		class: () => (railOpen.value ? 'doc-layout doc-rail-open' : 'doc-layout'),
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
			rel: 'alternate' as const,
			hreflang: localeHtmlLang[loc],
			href: localeDocHref(loc, props.currentStem ?? HOME_STEM),
		})),
	],
});

watch(railOpen, (open) => {
	if (import.meta.env.SSR) return;
	document.body.classList.toggle('doc-rail-open', open);
	document.body.style.overflow = open ? 'hidden' : '';
	if (!open) return;
	window.requestAnimationFrame(() => {
		scrollActiveRailNavIntoView();
		syncRailScrollEdges();
	});
});

watch(desktopRail, (wide) => {
	if (wide) setRailOpen(false);
});

onMounted(() => {
	scrollActiveRailNavIntoView();
	layoutAbort = new AbortController();
	const { signal } = layoutAbort;
	document.addEventListener(
		'click',
		(e: MouseEvent) => {
			const t = e.target;
			if (!(t instanceof Element)) return;
			if (t.closest('[data-header-menu]')) return;
			closeHeaderMenu();
		},
		{ signal },
	);
	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (e.key !== 'Escape' || e.defaultPrevented) return;
			closeHeaderMenu();
			setRailOpen(false);
		},
		{ signal },
	);
});

onUnmounted(() => {
	layoutAbort?.abort();
	layoutAbort = null;
	document.body.classList.remove('doc-rail-open');
	document.body.style.overflow = '';
});

watch(
	() => [props.locale, props.currentStem ?? '', props.notFound === true] as const,
	async () => {
		if (import.meta.env.SSR) return;
		resetTocSyncState();
		closeHeaderMenu();
		setRailOpen(false);
		await nextTick();
		closePagefindModal();
		ensurePagefindTriggers();
		tocSync();
		requestAnimationFrame(() => {
			tocSync();
		});
		mainEl.value?.focus({ preventScroll: true });
	},
);
</script>

<template>
	<a class="skip-link" href="#main-content">{{ t.skipToContent }}</a>
	<pagefind-config :bundle-path="pagefindBundle" :lang="locale" />
	<div class="shell">
		<div
			class="rail-backdrop"
			id="rail-backdrop"
			:aria-hidden="railOpen ? 'false' : 'true'"
			@click="setRailOpen(false)"
		/>
		<aside
			ref="railAside"
			class="rail"
			id="doc-rail"
			:aria-label="t.docNavAria"
			:aria-modal="railOpen ? 'true' : undefined"
			data-pagefind-ignore
			@click="onRailClick"
		>
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
				<div ref="slotRail" id="tool-slot-rail" class="tool-slot tool-slot--rail"></div>
				<div class="rail-header__actions">
					<div class="rail-header__search-slot">
						<PagefindToolbarTrigger :search-hint="t.searchHint" :search-open-aria="t.searchOpenAria" />
					</div>
				</div>
			</header>
			<div class="rail-body">
				<div
					ref="railScrollClip"
					class="rail-scroll-clip"
					data-rail-scroll-clip
					data-edge-top="0"
					data-edge-bottom="1"
				>
					<div ref="railScrollEl" class="rail-scroll">
						<RailNavSections
							:locale="locale"
							id-prefix="doc"
							:rail="rail"
							:rail-nav-aria="t.railNavAria"
							:current-stem="currentStem"
							@expand-change="syncRailScrollEdges"
						/>
					</div>
					<div class="rail-scroll__edge rail-scroll__edge--top" aria-hidden="true" />
					<div class="rail-scroll__edge rail-scroll__edge--bottom" aria-hidden="true" />
				</div>
				<div class="rail-footer">
					<ul class="rail-footer__links">
						<li>
							<RouterLink
								:class="{ 'is-current': currentStem === HOME_STEM }"
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
				<nav
					v-if="breadcrumbs.length"
					class="breadcrumbs"
					:aria-label="t.breadcrumbsAria"
					@click="onBreadcrumbsClick"
				>
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
					<Teleport defer :disabled="toolbarWide || !slotRail" :to="slotRail ?? 'body'">
						<div id="tool-float" class="tool-float">
							<div class="bar__search bar__search--drawer" data-pagefind-ignore>
								<PagefindToolbarTrigger :search-hint="t.searchHint" :search-open-aria="t.searchOpenAria" />
							</div>
							<LangSwitcher
								:locale="locale"
								:href-by-locale="hrefByLocale"
								:t="t"
								:open="headerMenu === 'lang'"
								@toggle="toggleHeaderMenu('lang')"
								@close="closeHeaderMenu"
							/>
							<div class="bar__desk">
								<ThemeToggleHint :theme-toggle-aria="t.themeToggleAria" :theme-toggle-hint="t.themeToggleHint" />
								<CopyPageMarkdownToolbar
									v-if="!notFound && mdViewHref"
									:markdown="markdown ?? ''"
									:md-view-href="mdViewHref"
									:open="headerMenu === 'copy'"
									:t="t"
									@toggle="toggleHeaderMenu('copy')"
									@close="closeHeaderMenu"
								/>
							</div>
						</div>
					</Teleport>
					<button
						type="button"
						class="rail-menu-trigger"
						id="rail-menu-toggle"
						:aria-expanded="railOpen ? 'true' : 'false'"
						aria-controls="doc-rail"
						:aria-label="railOpen ? t.railMenuCloseAria : t.railMenuOpenAria"
						@click="setRailOpen(!railOpen)"
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
					<main ref="mainEl" id="main-content" class="read-main" tabindex="-1" data-pagefind-body>
						<slot />
					</main>
					<aside v-show="tocItems.length > 0" class="toc" :aria-label="t.tocAsideAria" data-pagefind-ignore>
						<div class="toc__inner">
							<ul ref="tocListEl" class="toc__list" id="doc-toc-list" style="--top: 0px; --height: 0px">
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
