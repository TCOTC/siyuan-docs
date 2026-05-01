import { DOC_SCROLL_SESSION_PREFIX } from '../lib/docScrollSession';
import {
	scrollActiveRailNavIntoView,
	shouldSuppressRailScrollbarTransient,
	syncDocOverlayLayoutMetrics,
	syncRailScrollEdges,
	tocSync,
} from './lib/doc-reading-sync';
import { runDocShellBootstrap } from './lib/doc-shell-bootstrap';

(function initShellUi(): void {
	function readCodeCopyI18n(): {
		copyAria: string;
		copiedAria: string;
		failedAria: string;
	} {
		const el = document.getElementById('siyuan-code-copy-i18n');
		const fallback = {
			copyAria: 'Copy code',
			copiedAria: 'Copied',
			failedAria: 'Copy failed',
		};
		if (!el?.textContent?.trim()) return fallback;
		try {
			const j = JSON.parse(el.textContent) as Record<string, unknown>;
			return {
				copyAria: typeof j.copyAria === 'string' ? j.copyAria : fallback.copyAria,
				copiedAria: typeof j.copiedAria === 'string' ? j.copiedAria : fallback.copiedAria,
				failedAria: typeof j.failedAria === 'string' ? j.failedAria : fallback.failedAria,
			};
		} catch {
			return fallback;
		}
	}

	if (document.body.classList.contains('doc-layout')) {
		runDocShellBootstrap();
	}

	const themeKey = 'siyuan-docs-theme';
	function getSystemTheme(): 'dark' | 'light' {
		try {
			return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		} catch {
			return 'light';
		}
	}
	function getTheme(): 'dark' | 'light' {
		const t = document.documentElement.getAttribute('data-theme');
		return t === 'dark' ? 'dark' : 'light';
	}
	/** 手动选择主题并写入 localStorage（清除该键后恢复按系统 prefers-color-scheme） */
	function setTheme(next: 'dark' | 'light'): void {
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem(themeKey, next);
		} catch {
			/* 私密模式等 */
		}
	}
	function applySystemThemeIfUnpinned(): void {
		try {
			const t = localStorage.getItem(themeKey);
			if (t === 'light' || t === 'dark') return;
		} catch {
			/* ignore */
		}
		document.documentElement.setAttribute('data-theme', getSystemTheme());
	}

	const mqColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
	function onSystemColorSchemeChange(): void {
		applySystemThemeIfUnpinned();
	}
	if (mqColorScheme.addEventListener) {
		mqColorScheme.addEventListener('change', onSystemColorSchemeChange);
	} else if (mqColorScheme.addListener) {
		mqColorScheme.addListener(onSystemColorSchemeChange);
	}

	window.addEventListener('storage', (e: StorageEvent) => {
		if (e.key !== themeKey) return;
		const v = e.newValue;
		if (v === 'light' || v === 'dark') {
			document.documentElement.setAttribute('data-theme', v);
		} else {
			document.documentElement.setAttribute('data-theme', getSystemTheme());
		}
	});

	document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) => {
		btn.addEventListener('click', () => {
			setTheme(getTheme() === 'dark' ? 'light' : 'dark');
		});
	});

	document.querySelectorAll<HTMLAnchorElement>('a[data-lang-locale]').forEach((a) => {
		a.addEventListener('click', () => {
			try {
				const loc = a.getAttribute('data-lang-locale');
				if (loc === 'en' || loc === 'zh') {
					localStorage.setItem('siyuan-docs-locale', loc);
				}
			} catch {
				/* ignore */
			}
		});
	});

	const docToolbarFloater = document.getElementById('doc-toolbar-floater');
	const docToolbarSlotHead = document.getElementById('doc-toolbar-slot-content-head');
	const docToolbarSlotRail = document.getElementById('doc-toolbar-slot-rail');
	if (
		docToolbarFloater &&
		docToolbarSlotHead &&
		docToolbarSlotRail &&
		document.body.classList.contains('doc-layout')
	) {
		const mqDocToolbar = window.matchMedia('(min-width: 450px)');
		function placeDocToolbar(): void {
			if (mqDocToolbar.matches) {
				docToolbarSlotHead!.appendChild(docToolbarFloater!);
			} else {
				docToolbarSlotRail!.appendChild(docToolbarFloater!);
			}
		}
		placeDocToolbar();
		if (mqDocToolbar.addEventListener) {
			mqDocToolbar.addEventListener('change', placeDocToolbar);
		} else if (mqDocToolbar.addListener) {
			mqDocToolbar.addListener(placeDocToolbar);
		}
	}

	function copyMainAsMarkdown(): Promise<boolean> {
		const btn = document.getElementById('copy-page-md');
		const mdSrc = btn?.getAttribute('data-copy-md-src');
		if (mdSrc) {
			return fetch(mdSrc, { credentials: 'same-origin' })
				.then((res) => {
					if (!res.ok) return Promise.resolve('');
					return res.text();
				})
				.then((text) => {
					if (!text || typeof text !== 'string') return false;
					if (!navigator.clipboard?.writeText) return false;
					return navigator.clipboard
						.writeText(text)
						.then(() => true)
						.catch(() => false);
				})
				.catch(() => false);
		}
		const main = document.getElementById('main-content');
		if (!main) return Promise.resolve(false);
		const fallback = main.innerText.replace(/\s+\n/g, '\n').trim();
		if (fallback && navigator.clipboard?.writeText) {
			return navigator.clipboard
				.writeText(fallback)
				.then(() => true)
				.catch(() => false);
		}
		return Promise.resolve(false);
	}

	const copyPageMdBtn = document.getElementById('copy-page-md');
	let copyFeedbackTimer: number | undefined;
	function flashCopyPageMdFeedback(success: boolean): void {
		if (!copyPageMdBtn) return;
		copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
		if (success) {
			copyPageMdBtn.classList.add('copy-split__main--success');
		} else {
			copyPageMdBtn.classList.add('copy-split__main--error');
		}
		window.clearTimeout(copyFeedbackTimer);
		copyFeedbackTimer = window.setTimeout(() => {
			copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
		}, 1600);
	}

	function triggerCopyPageMdWithFeedback(): void {
		void copyMainAsMarkdown().then((ok) => {
			flashCopyPageMdFeedback(ok);
		});
	}

	document.querySelectorAll('.js-copy-page-md').forEach((el) => {
		el.addEventListener('click', () => {
			triggerCopyPageMdWithFeedback();
		});
	});

	function isGlobalShortcutTarget(el: EventTarget | null): boolean {
		return !!(el instanceof Element && el.closest('input, textarea, select, [contenteditable="true"]'));
	}

	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (isGlobalShortcutTarget(e.target)) return;
			if (e.defaultPrevented) return;
			/* 仅单独按下 T 键（无任何修饰键），避免与 Ctrl+T、Shift+T 等冲突 */
			if (e.code === 'KeyT' && !e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey) {
				e.preventDefault();
				setTheme(getTheme() === 'dark' ? 'light' : 'dark');
			}
		},
		true,
	);

	const menuBtn = document.getElementById('copy-page-menu-btn');
	const panel = document.getElementById('copy-page-menu');
	const copyPageMenuMd = document.getElementById('copy-page-menu-md');
	const viewPageMd = document.getElementById('copy-page-view-md');
	const langMenuBtn = document.getElementById('lang-switch-btn');
	const langMenuPanel = document.getElementById('lang-switch-panel');
	function closeCopyMenu(): void {
		if (!panel || !menuBtn) return;
		panel.hidden = true;
		panel.classList.remove('is-open');
		menuBtn.setAttribute('aria-expanded', 'false');
	}
	function openCopyMenu(): void {
		if (!panel || !menuBtn) return;
		panel.hidden = false;
		panel.classList.add('is-open');
		menuBtn.setAttribute('aria-expanded', 'true');
	}
	function closeLangMenu(): void {
		if (!langMenuPanel || !langMenuBtn) return;
		langMenuPanel.hidden = true;
		langMenuPanel.classList.remove('is-open');
		langMenuBtn.setAttribute('aria-expanded', 'false');
	}
	function openLangMenu(): void {
		if (!langMenuPanel || !langMenuBtn) return;
		langMenuPanel.hidden = false;
		langMenuPanel.classList.add('is-open');
		langMenuBtn.setAttribute('aria-expanded', 'true');
	}
	if (menuBtn && panel) {
		menuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			closeLangMenu();
			if (panel.classList.contains('is-open')) closeCopyMenu();
			else openCopyMenu();
		});
		panel.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
	if (langMenuBtn && langMenuPanel) {
		langMenuBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			closeCopyMenu();
			if (langMenuPanel.classList.contains('is-open')) closeLangMenu();
			else openLangMenu();
		});
		langMenuPanel.addEventListener('click', (e) => {
			e.stopPropagation();
		});
	}
	document.addEventListener('click', () => {
		closeCopyMenu();
		closeLangMenu();
	});
	document.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key !== 'Escape' || e.defaultPrevented) return;
		closeCopyMenu();
		closeLangMenu();
	});
	if (copyPageMenuMd) {
		copyPageMenuMd.addEventListener('click', () => {
			triggerCopyPageMdWithFeedback();
			closeCopyMenu();
		});
	}
	if (viewPageMd) {
		viewPageMd.addEventListener('click', () => {
			closeCopyMenu();
		});
	}
	const railToggle = document.getElementById('rail-menu-toggle');
	const railBackdrop = document.getElementById('rail-backdrop');
	const railAside = document.getElementById('doc-left-rail');
	function syncDocOverlayTop(): void {
		syncDocOverlayLayoutMetrics();
	}
	function setDocRailOpen(open: boolean): void {
		document.body.classList.toggle('doc-rail-open', open);
		if (railToggle) {
			railToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
			const whenOpen = railToggle.getAttribute('data-aria-when-open') || '';
			const whenClosed = railToggle.getAttribute('data-aria-when-closed') || '';
			railToggle.setAttribute('aria-label', open ? whenOpen : whenClosed);
		}
		if (railBackdrop) {
			railBackdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
		}
		if (railAside) {
			if (open) {
				railAside.setAttribute('aria-modal', 'true');
			} else {
				railAside.removeAttribute('aria-modal');
			}
		}
		try {
			document.body.style.overflow = open ? 'hidden' : '';
		} catch {
			/* ignore */
		}
		if (open) {
			syncDocOverlayTop();
			window.requestAnimationFrame(() => {
				scrollActiveRailNavIntoView();
				syncRailScrollEdges();
			});
		}
	}
	function closeDocRail(): void {
		setDocRailOpen(false);
	}
	if (railToggle && railBackdrop && railAside) {
		railToggle.addEventListener('click', () => {
			setDocRailOpen(!document.body.classList.contains('doc-rail-open'));
		});
		railBackdrop.addEventListener('click', closeDocRail);
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.body.classList.contains('doc-rail-open')) {
				closeDocRail();
			}
		});
		railAside.addEventListener('click', (e) => {
			const t = e.target;
			if (t instanceof Element && t.closest('a[href]')) {
				closeDocRail();
			}
		});
		/* 自 851px 起为固定侧栏档，离开 0–850px 抽屉档时关闭抽屉 */
		const mqDocMid = window.matchMedia('(width >= 851px)');
		function onDocMidTier(e: MediaQueryListEvent): void {
			if (e.matches) {
				closeDocRail();
			}
		}
		if (mqDocMid.addEventListener) {
			mqDocMid.addEventListener('change', onDocMidTier);
		} else if (mqDocMid.addListener) {
			mqDocMid.addListener(onDocMidTier);
		}
		window.addEventListener(
			'resize',
			() => {
				if (document.body.classList.contains('doc-rail-open')) {
					syncDocOverlayTop();
				}
			},
			{ passive: true },
		);
	}

	const railScrollEl = document.querySelector('.rail-scroll');
	const railScrollClip = document.querySelector('[data-rail-scroll-clip]');
	const railScrollbarHideMs = 1000;
	function wireRailScrollbarOnScroll(el: Element | null): void {
		if (!el) return;
		const scrollEl = el;
		let hideTimer: number | null = null;
		function showRailScrollbarTransient(): void {
			if (shouldSuppressRailScrollbarTransient()) return;
			scrollEl.classList.add('rail-scrollbar--visible');
			if (hideTimer) window.clearTimeout(hideTimer);
			hideTimer = window.setTimeout(() => {
				hideTimer = null;
				scrollEl.classList.remove('rail-scrollbar--visible');
			}, railScrollbarHideMs);
		}
		scrollEl.addEventListener('scroll', showRailScrollbarTransient, { passive: true });
	}
	if (railScrollEl && railScrollClip) {
		railScrollEl.addEventListener('scroll', () => syncRailScrollEdges(), { passive: true });
		window.addEventListener('resize', () => syncRailScrollEdges(), { passive: true });
		if (typeof ResizeObserver !== 'undefined') {
			const roRailScroll = new ResizeObserver(() => syncRailScrollEdges());
			roRailScroll.observe(railScrollEl);
		}
		syncRailScrollEdges();
	}
	wireRailScrollbarOnScroll(railScrollEl);
	const railScrollAside = document.getElementById('doc-left-rail');
	if (railScrollAside && railScrollAside !== railScrollEl) {
		wireRailScrollbarOnScroll(railScrollAside);
	}

	if (document.body.classList.contains('doc-layout')) {
		syncDocOverlayTop();
		requestAnimationFrame(() => {
			syncDocOverlayTop();
		});
		window.addEventListener('resize', syncDocOverlayTop, { passive: true });
		const mqTocTier = window.matchMedia('(min-width: 1000px)');
		function onTocTierChange(): void {
			syncDocOverlayTop();
		}
		if (mqTocTier.addEventListener) {
			mqTocTier.addEventListener('change', onTocTierChange);
		} else if (mqTocTier.addListener) {
			mqTocTier.addListener(onTocTierChange);
		}
		const docCenterRo = document.querySelector('.doc-center');
		if (docCenterRo && typeof ResizeObserver !== 'undefined') {
			const roDocCenter = new ResizeObserver(() => syncDocOverlayTop());
			roDocCenter.observe(docCenterRo);
		}
		/* 点击面包屑当前页标题（.breadcrumbs__current）：回文档开头，与同页 href 刷新区分 */
		const contentHeadEl = document.querySelector('.content-head');
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
							const u = new URL(hit.getAttribute('href') || '', location.href);
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
					try {
						sessionStorage.setItem(
							DOC_SCROLL_SESSION_PREFIX + location.pathname + location.search,
							'0',
						);
					} catch {
						/* ignore */
					}
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
		(function scheduleEndDocRailScrollBoot(): void {
			let ended = false;
			const finish = (): void => {
				if (ended) return;
				ended = true;
				syncDocOverlayTop();
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						document.documentElement.classList.remove('doc-rail-scroll-boot');
					});
				});
			};
			const loadPromise =
				document.readyState === 'complete'
					? Promise.resolve()
					: new Promise<void>((resolve) => {
							window.addEventListener('load', () => resolve(), { once: true });
						});
			const fontsPromise =
				document.fonts && typeof document.fonts.ready !== 'undefined'
					? document.fonts.ready
					: Promise.resolve();
			void Promise.all([loadPromise, fontsPromise]).then(finish).catch(finish);
			window.setTimeout(finish, 2500);
		})();
	}

	const docRailNav = document.querySelector('.rail-nav');
	if (docRailNav) {
		docRailNav.addEventListener('click', (e) => {
			const btn =
				e.target instanceof Element ? e.target.closest('.rail-nav__trigger') : null;
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

	/* 本页目录：与正文滚动同步；凡本节（标题至下一标题）与阅读视口相交则高亮，可多选（--top / --height 覆盖全部活动项） */
	const tocList = document.getElementById('doc-toc-list');
	const docMainEl = document.getElementById('main-content');
	if (tocList && docMainEl && docMainEl.classList.contains('doc-main')) {
		let tocRaf: number | null = null;
		function tocSchedule(): void {
			if (tocRaf != null) return;
			tocRaf = requestAnimationFrame(() => {
				tocRaf = null;
				tocSync();
			});
		}
		function tocScheduleSoon(): void {
			tocSchedule();
			requestAnimationFrame(() => {
				tocSchedule();
			});
			setTimeout(tocSchedule, 0);
			setTimeout(tocSchedule, 64);
		}
		function tocBindScrollTargets(fn: () => void): void {
			if (!docMainEl) return;
			/* 文档区为 document 滚动时由 window 触发；保留 .doc-reading 监听以兼容未来改回内层滚动 */
			const docScrollRoot = docMainEl.closest('.doc-reading');
			if (docScrollRoot) {
				docScrollRoot.addEventListener('scroll', fn, { passive: true });
				try {
					docScrollRoot.addEventListener('scrollend', fn, { passive: true });
				} catch {
					/* Safari 旧版无 scrollend */
				}
			}
			window.addEventListener('scroll', fn, { passive: true });
		}
		tocBindScrollTargets(tocSchedule);
		window.addEventListener('resize', tocSchedule, { passive: true });
		window.addEventListener('hashchange', tocScheduleSoon, { passive: true });
		tocList.addEventListener('click', (e) => {
			const t = e.target;
			const a = t instanceof Element ? t.closest('a[href^="#"]') : null;
			if (!a || !tocList.contains(a)) return;
			tocScheduleSoon();
		});
		const tocBoot = typeof window !== 'undefined' && window.__siyuanDocsTocBootstrapped;
		if (tocBoot) {
			delete window.__siyuanDocsTocBootstrapped;
		} else {
			tocSchedule();
		}
		window.addEventListener(
			'load',
			() => {
				requestAnimationFrame(() => {
					tocSync();
				});
			},
			{ once: true },
		);
	}

	/* 正文代码块（Shiki pre）右上角复制 */
	(function initCodeBlockCopy(): void {
		const { copyAria, copiedAria, failedAria } = readCodeCopyI18n();
		const copySvg =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
		const checkSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
		const xSvg =
			'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
		function getCodePlainText(pre: HTMLElement): string {
			const c = pre.querySelector('code');
			if (c) return c.innerText || '';
			const clone = pre.cloneNode(true) as HTMLElement;
			const rm = clone.querySelector('.code-block-copy');
			if (rm) rm.remove();
			return (clone.textContent || '').replace(/\s+$/, '');
		}
		function wireCopyButton(btn: HTMLButtonElement, pre: HTMLElement): void {
			const idleEl = btn.querySelector('.code-block-copy__state--idle');
			const doneEl = btn.querySelector('.code-block-copy__state--done');
			const errEl = btn.querySelector('.code-block-copy__state--error');
			let feedbackTimer: number;
			function resetIdle(): void {
				btn.classList.remove('code-block-copy--success', 'code-block-copy--error');
				btn.setAttribute('aria-label', copyAria);
				if (idleEl) idleEl.removeAttribute('hidden');
				if (doneEl) doneEl.setAttribute('hidden', '');
				if (errEl) errEl.setAttribute('hidden', '');
			}
			function flashSuccess(): void {
				window.clearTimeout(feedbackTimer);
				btn.classList.remove('code-block-copy--error');
				if (errEl) errEl.setAttribute('hidden', '');
				btn.classList.add('code-block-copy--success');
				btn.setAttribute('aria-label', copiedAria);
				if (idleEl) idleEl.setAttribute('hidden', '');
				if (doneEl) doneEl.removeAttribute('hidden');
				feedbackTimer = window.setTimeout(resetIdle, 1600);
			}
			function flashError(): void {
				window.clearTimeout(feedbackTimer);
				btn.classList.remove('code-block-copy--success');
				if (doneEl) doneEl.setAttribute('hidden', '');
				btn.classList.add('code-block-copy--error');
				btn.setAttribute('aria-label', failedAria);
				if (idleEl) idleEl.setAttribute('hidden', '');
				if (errEl) errEl.removeAttribute('hidden');
				feedbackTimer = window.setTimeout(resetIdle, 1600);
			}
			btn.addEventListener('click', () => {
				const text = getCodePlainText(pre);
				if (!text || !navigator.clipboard?.writeText) {
					flashError();
					return;
				}
				void navigator.clipboard.writeText(text).then(flashSuccess).catch(flashError);
			});
		}
		document.querySelectorAll<HTMLElement>('.prose pre').forEach((pre) => {
			if (pre.querySelector('.code-block-copy')) return;
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'icon-btn code-block-copy';
			btn.setAttribute('aria-label', copyAria);
			btn.innerHTML =
				`<span class="code-block-copy__state code-block-copy__state--idle">${copySvg}</span>` +
				`<span class="code-block-copy__state code-block-copy__state--done" hidden>${checkSvg}</span>` +
				`<span class="code-block-copy__state code-block-copy__state--error" hidden>${xSvg}</span>`;
			wireCopyButton(btn, pre);
			pre.appendChild(btn);
		});
	})();
})();
