import { DOC_SCROLL_SESSION_PREFIX } from '../../../lib/docScrollSession';
import { onMediaQueryChange } from '../media-query';
import { safeSessionSet } from '../safe-storage';
import { syncDocOverlayLayoutMetrics, syncRailScrollEdges, tocSync } from '../doc-reading-sync';
import { setRailScrollBootSuppress } from '../doc-window-runtime';

function scheduleEndDocRailScrollBoot(): void {
	let ended = false;
	const finish = (): void => {
		if (ended) return;
		ended = true;
		syncDocOverlayLayoutMetrics();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setRailScrollBootSuppress(false);
			});
		});
	};
	const loadPromise =
		document.readyState === 'complete'
			? Promise.resolve()
			: new Promise<void>((resolve) => {
					window.addEventListener('load', () => resolve(), { once: true });
				});
	void Promise.all([loadPromise, document.fonts.ready]).then(finish).catch(finish);
	window.setTimeout(finish, 2500);
}

/** 文档页 overlay 度量、面包屑回顶、侧栏滚动 boot 结束、侧栏分组折叠 */
export function mountDocLayoutChrome(): void {
	syncDocOverlayLayoutMetrics();
	requestAnimationFrame(() => {
		syncDocOverlayLayoutMetrics();
	});
	window.addEventListener('resize', syncDocOverlayLayoutMetrics, { passive: true });
	const mqTocTier = window.matchMedia('(min-width: 1000px)');
	onMediaQueryChange(mqTocTier, () => {
		syncDocOverlayLayoutMetrics();
	});
	const docCenterRo = document.querySelector('.sheet');
	if (docCenterRo) {
		const roDocCenter = new ResizeObserver(() => syncDocOverlayLayoutMetrics());
		roDocCenter.observe(docCenterRo);
	}
	/* 点击面包屑当前页标题（.breadcrumbs__current）：回文档开头，与同页 href 刷新区分 */
	const contentHeadEl = document.querySelector('.bar');
	if (contentHeadEl instanceof HTMLElement) {
		contentHeadEl.addEventListener(
			'click',
			(e: MouseEvent) => {
				if (e.defaultPrevented) return;
				if (e.button !== 0) return;
				if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
				const t = e.target;
				if (!(t instanceof Element)) return;
				const hit = t.closest('a.breadcrumbs__current, span.breadcrumbs__current');
				if (!hit || !contentHeadEl.contains(hit)) return;
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
				if (hit instanceof HTMLAnchorElement) {
					e.preventDefault();
				}
				try {
					if (location.hash) {
						history.replaceState(null, '', location.pathname + location.search);
					}
				} catch {
					/* ignore */
				}
				safeSessionSet(DOC_SCROLL_SESSION_PREFIX + location.pathname + location.search, '0');
				window.scrollTo({ top: 0, behavior: 'smooth' });
				tocSync();
				requestAnimationFrame(() => {
					tocSync();
				});
				window.setTimeout(() => {
					tocSync();
				}, 0);
				window.setTimeout(() => {
					tocSync();
				}, 64);
			},
			{ passive: false },
		);
	}
	scheduleEndDocRailScrollBoot();

	const docRailNav = document.querySelector('.rail-nav');
	if (docRailNav) {
		docRailNav.addEventListener('click', (e) => {
			const btn = e.target instanceof Element ? e.target.closest('.rail-nav__trigger') : null;
			if (!btn || !docRailNav.contains(btn)) return;
			const expanded = btn.getAttribute('aria-expanded') === 'true';
			const next = !expanded;
			btn.setAttribute('aria-expanded', next ? 'true' : 'false');
			const panelId = btn.getAttribute('aria-controls');
			const navPanel = panelId ? document.getElementById(panelId) : null;
			const section = btn.closest('.rail-nav__section');
			if (navPanel) navPanel.hidden = !next;
			if (section) section.setAttribute('data-state', next ? 'open' : 'closed');
			requestAnimationFrame(() => syncRailScrollEdges());
		});
	}
}
