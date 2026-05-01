import { localeHtmlLang, type AppLocale } from '../lib/appLocale';
import { detectLocale } from '../lib/localePreference';
import type { NotFoundLocalePatch } from '../lib/notFoundLocale';

declare global {
	interface Window {
		__NF_LOCALE__?: { base: string; patchZh: NotFoundLocalePatch };
	}
}

(function initI18n404(): void {
	const cfg = window.__NF_LOCALE__;
	if (!cfg) return;
	const { base, patchZh } = cfg;

	function applyNotFoundHeadZh(p: NotFoundLocalePatch): void {
		document.title = p.title;
		const meta = document.querySelector('meta[name="description"]');
		if (meta) meta.setAttribute('content', p.description);
	}

	function applyNotFoundBodyZh(p: NotFoundLocalePatch): void {
		const pfc = document.querySelector('pagefind-config');
		if (pfc) pfc.setAttribute('lang', p.pagefindLang);

		const skip = document.querySelector('.skip-link');
		if (skip) skip.textContent = p.skipToContent;

		const aside = document.getElementById('doc-rail');
		if (aside) aside.setAttribute('aria-label', p.docNavAria);

		/* 404 双品牌由 `Shell` 叠放 SSR，随 `data-doc-locale` 切换；勿改写避免闪动 */
		if (!document.querySelector('.rail-header__brand-i18n-stack')) {
			const railBrand = document.querySelector('.rail-header .brand-lockup--rail');
			if (railBrand instanceof HTMLAnchorElement) {
				railBrand.setAttribute('href', p.railBrandHref);
				const railLbl = railBrand.querySelector('.brand-lockup__text');
				if (railLbl) railLbl.textContent = p.railSiteLabel;
			}
		}

		document.querySelectorAll('.rail-header .hint--pf .hint__txt').forEach((el) => {
			el.textContent = p.searchHint;
		});

		document.querySelectorAll('.pf-search-placeholder').forEach((btn) => {
			btn.setAttribute('aria-label', p.searchOpenAria);
		});

		const floater = document.getElementById('tool-float');
		if (floater) {
			const hint = floater.querySelector('.hint--pf .hint__txt');
			if (hint) hint.textContent = p.searchHint;
		}

		const themeBtn = document.getElementById('theme-toggle');
		if (themeBtn) {
			themeBtn.setAttribute('aria-label', p.themeToggleAria);
			const th = themeBtn.closest('[data-anchored-floating-hint]');
			if (th) {
				const tl = th.querySelector('[data-floating-hint-layer] .hint__txt');
				if (tl) tl.textContent = p.themeToggleHint;
			}
		}

		const copyBtn = document.getElementById('copy-page-md');
		if (copyBtn) {
			copyBtn.setAttribute('aria-label', p.copyPageMdAria);
			const cw = copyBtn.closest('[data-anchored-floating-hint]');
			if (cw) {
				const cl = cw.querySelector('[data-floating-hint-layer] .hint__txt');
				if (cl) cl.textContent = p.copyPageHint;
			}
		}

		const copyMenuBtn = document.getElementById('copy-page-menu-btn');
		if (copyMenuBtn) copyMenuBtn.setAttribute('aria-label', p.copyMenuMoreTitle);

		const copyMd = document.getElementById('copy-page-menu-md');
		if (copyMd) {
			const t1 = copyMd.querySelector('.copy-split__panel-item__title');
			const d1 = copyMd.querySelector('.copy-split__panel-item__desc');
			if (t1) t1.textContent = p.copyMenuMdTitle;
			if (d1) d1.textContent = p.copyMenuMdDesc;
		}

		const viewMd = document.getElementById('copy-page-view-md');
		if (viewMd) {
			const t2 = viewMd.querySelector('.copy-split__panel-item__title');
			const d2 = viewMd.querySelector('.copy-split__panel-item__desc');
			if (t2) t2.textContent = p.copyMenuViewTitle;
			if (d2) d2.textContent = p.copyMenuViewDesc;
		}

		const langBtn = document.getElementById('lang-switch-btn');
		const langPanel = document.getElementById('lang-switch-panel');
		if (langBtn) langBtn.setAttribute('aria-label', p.langSwitcherAria);
		if (langPanel) langPanel.setAttribute('aria-label', p.langSwitcherAria);

		document.querySelectorAll('[data-lang-menu-btn]').forEach((btn) => {
			const wrap = btn.closest('[data-lang-switch]');
			if (!wrap) return;
			const hintLayer = wrap.querySelector('[data-floating-hint-layer] .hint__txt');
			if (hintLayer) hintLayer.textContent = p.langSwitcherHint;
		});

		const railToggle = document.getElementById('rail-menu-toggle');
		if (railToggle) {
			railToggle.setAttribute('data-aria-when-open', p.railMenuCloseAria);
			railToggle.setAttribute('data-aria-when-closed', p.railMenuOpenAria);
			const open = railToggle.getAttribute('aria-expanded') === 'true';
			railToggle.setAttribute('aria-label', open ? p.railMenuCloseAria : p.railMenuOpenAria);
		}
	}

	function syncLangLinkAriaCurrent(loc: AppLocale): void {
		document.querySelectorAll('a[data-lang-locale]').forEach((a) => {
			const v = a.getAttribute('data-lang-locale');
			if (v === loc) a.setAttribute('aria-current', 'page');
			else a.removeAttribute('aria-current');
		});
	}

	const loc = detectLocale(location.pathname, base);
	document.documentElement.setAttribute('data-doc-locale', loc);
	document.documentElement.setAttribute(
		'lang',
		localeHtmlLang[loc] ?? loc,
	);

	if (loc === 'zh') applyNotFoundHeadZh(patchZh);

	function onDomReady(): void {
		syncLangLinkAriaCurrent(loc);
		if (loc === 'zh') applyNotFoundBodyZh(patchZh);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', onDomReady);
	} else {
		onDomReady();
	}
})();
