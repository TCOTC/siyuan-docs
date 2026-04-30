// @ts-nocheck
(function () {
				var themeKey = 'siyuan-docs-theme';
				function getSystemTheme() {
					try {
						return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
					} catch (e) {
						return 'light';
					}
				}
				function getTheme() {
					var t = document.documentElement.getAttribute('data-theme');
					return t === 'dark' ? 'dark' : 'light';
				}
				function syncThemeIcons() {
					var dark = getTheme() === 'dark';
					document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
						var sun = btn.querySelector('.theme-icon--sun');
						var moon = btn.querySelector('.theme-icon--moon');
						if (sun) sun.style.display = dark ? 'block' : 'none';
						if (moon) moon.style.display = dark ? 'none' : 'block';
					});
				}
				/** 手动选择主题并写入 localStorage（清除该键后恢复按系统 prefers-color-scheme） */
				function setTheme(next) {
					document.documentElement.setAttribute('data-theme', next);
					try {
						localStorage.setItem(themeKey, next);
					} catch (e) {}
					syncThemeIcons();
				}
				function applySystemThemeIfUnpinned() {
					try {
						var t = localStorage.getItem(themeKey);
						if (t === 'light' || t === 'dark') return;
					} catch (e) {}
					document.documentElement.setAttribute('data-theme', getSystemTheme());
					syncThemeIcons();
				}

				var mqColorScheme = window.matchMedia('(prefers-color-scheme: dark)');
				function onSystemColorSchemeChange() {
					applySystemThemeIfUnpinned();
				}
				if (mqColorScheme.addEventListener) {
					mqColorScheme.addEventListener('change', onSystemColorSchemeChange);
				} else if (mqColorScheme.addListener) {
					mqColorScheme.addListener(onSystemColorSchemeChange);
				}

				window.addEventListener('storage', function (e) {
					if (e.key !== themeKey) return;
					var v = e.newValue;
					if (v === 'light' || v === 'dark') {
						document.documentElement.setAttribute('data-theme', v);
					} else {
						document.documentElement.setAttribute('data-theme', getSystemTheme());
					}
					syncThemeIcons();
				});

				document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
					btn.addEventListener('click', function () {
						setTheme(getTheme() === 'dark' ? 'light' : 'dark');
					});
				});
				syncThemeIcons();

				document.querySelectorAll('a[data-lang-locale]').forEach(function (a) {
					a.addEventListener('click', function () {
						try {
							var loc = a.getAttribute('data-lang-locale');
							if (loc === 'en' || loc === 'zh') {
								localStorage.setItem('siyuan-docs-locale', loc);
							}
						} catch (e) {}
					});
				});

				var docToolbarFloater = document.getElementById('doc-toolbar-floater');
				var docToolbarSlotHead = document.getElementById('doc-toolbar-slot-content-head');
				var docToolbarSlotRail = document.getElementById('doc-toolbar-slot-rail');
				if (docToolbarFloater && docToolbarSlotHead && docToolbarSlotRail && document.body.classList.contains('doc-layout')) {
					var mqDocToolbar = window.matchMedia('(min-width: 450px)');
					function placeDocToolbar() {
						if (mqDocToolbar.matches) {
							docToolbarSlotHead.appendChild(docToolbarFloater);
						} else {
							docToolbarSlotRail.appendChild(docToolbarFloater);
						}
					}
					placeDocToolbar();
					if (mqDocToolbar.addEventListener) {
						mqDocToolbar.addEventListener('change', placeDocToolbar);
					} else if (mqDocToolbar.addListener) {
						mqDocToolbar.addListener(placeDocToolbar);
					}
				}

				function copyMainAsMarkdown() {
					var btn = document.getElementById('copy-page-md');
					var mdSrc = btn && btn.getAttribute('data-copy-md-src');
					if (mdSrc) {
						return fetch(mdSrc, { credentials: 'same-origin' })
							.then(function (res) {
								if (!res.ok) return false;
								return res.text();
							})
							.then(function (text) {
								if (!text || typeof text !== 'string') return false;
								if (!navigator.clipboard || !navigator.clipboard.writeText) return false;
								return navigator.clipboard
									.writeText(text)
									.then(function () {
										return true;
									})
									.catch(function () {
										return false;
									});
							})
							.catch(function () {
								return false;
							});
					}
					var main = document.getElementById('main-content');
					if (!main) return Promise.resolve(false);
					var fallback = main.innerText.replace(/\s+\n/g, '\n').trim();
					if (fallback && navigator.clipboard && navigator.clipboard.writeText) {
						return navigator.clipboard
							.writeText(fallback)
							.then(function () {
								return true;
							})
							.catch(function () {
								return false;
							});
					}
					return Promise.resolve(false);
				}

				var copyPageMdBtn = document.getElementById('copy-page-md');
				var copyFeedbackTimer;
				function flashCopyPageMdFeedback(success) {
					if (!copyPageMdBtn) return;
					copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
					if (success) {
						copyPageMdBtn.classList.add('copy-split__main--success');
					} else {
						copyPageMdBtn.classList.add('copy-split__main--error');
					}
					window.clearTimeout(copyFeedbackTimer);
					copyFeedbackTimer = window.setTimeout(function () {
						copyPageMdBtn.classList.remove('copy-split__main--success', 'copy-split__main--error');
					}, 1600);
				}

				function triggerCopyPageMdWithFeedback() {
					copyMainAsMarkdown().then(function (ok) {
						flashCopyPageMdFeedback(ok);
					});
				}

				document.querySelectorAll('.js-copy-page-md').forEach(function (el) {
					el.addEventListener('click', function () {
						triggerCopyPageMdWithFeedback();
					});
				});

				function isGlobalShortcutTarget(el) {
					return el && el.closest && !!el.closest('input, textarea, select, [contenteditable="true"]');
				}

				document.addEventListener(
					'keydown',
					function (e) {
						if (isGlobalShortcutTarget(e.target)) return;
						if (e.defaultPrevented) return;
						/* 仅单独按下 T 键（无任何修饰键），避免与 Ctrl+T、Shift+T 等冲突 */
						if (
							e.code === 'KeyT' &&
							!e.ctrlKey &&
							!e.metaKey &&
							!e.altKey &&
							!e.shiftKey
						) {
							e.preventDefault();
							setTheme(getTheme() === 'dark' ? 'light' : 'dark');
							return;
						}
					},
					true
				);

				var menuBtn = document.getElementById('copy-page-menu-btn');
				var panel = document.getElementById('copy-page-menu');
				var copyPageMenuMd = document.getElementById('copy-page-menu-md');
				var viewPageMd = document.getElementById('copy-page-view-md');
				var langMenuBtn = document.getElementById('lang-switch-btn');
				var langMenuPanel = document.getElementById('lang-switch-panel');
				function closeCopyMenu() {
					if (!panel || !menuBtn) return;
					panel.hidden = true;
					panel.classList.remove('is-open');
					menuBtn.setAttribute('aria-expanded', 'false');
				}
				function openCopyMenu() {
					if (!panel || !menuBtn) return;
					panel.hidden = false;
					panel.classList.add('is-open');
					menuBtn.setAttribute('aria-expanded', 'true');
				}
				function closeLangMenu() {
					if (!langMenuPanel || !langMenuBtn) return;
					langMenuPanel.hidden = true;
					langMenuPanel.classList.remove('is-open');
					langMenuBtn.setAttribute('aria-expanded', 'false');
				}
				function openLangMenu() {
					if (!langMenuPanel || !langMenuBtn) return;
					langMenuPanel.hidden = false;
					langMenuPanel.classList.add('is-open');
					langMenuBtn.setAttribute('aria-expanded', 'true');
				}
				if (menuBtn && panel) {
					menuBtn.addEventListener('click', function (e) {
						e.stopPropagation();
						closeLangMenu();
						if (panel.classList.contains('is-open')) closeCopyMenu();
						else openCopyMenu();
					});
					panel.addEventListener('click', function (e) {
						e.stopPropagation();
					});
				}
				if (langMenuBtn && langMenuPanel) {
					langMenuBtn.addEventListener('click', function (e) {
						e.stopPropagation();
						closeCopyMenu();
						if (langMenuPanel.classList.contains('is-open')) closeLangMenu();
						else openLangMenu();
					});
					langMenuPanel.addEventListener('click', function (e) {
						e.stopPropagation();
					});
				}
				document.addEventListener('click', function () {
					closeCopyMenu();
					closeLangMenu();
				});
				document.addEventListener('keydown', function (e) {
					if (e.key !== 'Escape' || e.defaultPrevented) return;
					closeCopyMenu();
					closeLangMenu();
				});
				if (copyPageMenuMd) {
					copyPageMenuMd.addEventListener('click', function () {
						triggerCopyPageMdWithFeedback();
						closeCopyMenu();
					});
				}
				if (viewPageMd) {
					viewPageMd.addEventListener('click', function () {
						closeCopyMenu();
					});
				}
				var railToggle = document.getElementById('rail-menu-toggle');
				var railBackdrop = document.getElementById('rail-backdrop');
				var railAside = document.getElementById('doc-left-rail');
				var contentHeadEl = document.querySelector('.content-head');
				function syncDocOverlayTop() {
					if (!contentHeadEl) return;
					try {
						var h = Math.ceil(contentHeadEl.getBoundingClientRect().height);
						document.documentElement.style.setProperty('--doc-overlay-top', h + 'px');
					} catch (e) {}
				}
				function setDocRailOpen(open) {
					document.body.classList.toggle('doc-rail-open', open);
					if (railToggle) {
						railToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
						var whenOpen = railToggle.getAttribute('data-aria-when-open') || '';
						var whenClosed = railToggle.getAttribute('data-aria-when-closed') || '';
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
					} catch (e) {}
					if (open) {
						syncDocOverlayTop();
					}
				}
				function closeDocRail() {
					setDocRailOpen(false);
				}
				if (railToggle && railBackdrop && railAside) {
					railToggle.addEventListener('click', function () {
						setDocRailOpen(!document.body.classList.contains('doc-rail-open'));
					});
					railBackdrop.addEventListener('click', closeDocRail);
					document.addEventListener('keydown', function (e) {
						if (e.key === 'Escape' && document.body.classList.contains('doc-rail-open')) {
							closeDocRail();
						}
					});
					railAside.addEventListener('click', function (e) {
						var t = e.target;
						if (t && t.closest && t.closest('a[href]')) {
							closeDocRail();
						}
					});
					/* 自 851px 起为固定侧栏档，离开 0–850px 抽屉档时关闭抽屉 */
					var mqDocMid = window.matchMedia('(width >= 851px)');
					function onDocMidTier(e) {
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
						function () {
							if (document.body.classList.contains('doc-rail-open')) {
								syncDocOverlayTop();
							}
						},
						{ passive: true }
					);
				}

				var railScrollEl = document.querySelector('.rail-scroll');
				var railScrollClip = document.querySelector('[data-rail-scroll-clip]');
				var railScrollbarHideMs = 1000;
				function wireRailScrollbarOnScroll(el) {
					if (!el) return;
					var hideTimer = null;
					function showRailScrollbarTransient() {
						el.classList.add('rail-scrollbar--visible');
						if (hideTimer) window.clearTimeout(hideTimer);
						hideTimer = window.setTimeout(function () {
							hideTimer = null;
							el.classList.remove('rail-scrollbar--visible');
						}, railScrollbarHideMs);
					}
					el.addEventListener('scroll', showRailScrollbarTransient, { passive: true });
				}
				function syncRailScrollEdges() {
					if (!railScrollEl || !railScrollClip) return;
					var el = railScrollEl;
					var maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
					var canScroll = maxScroll > 2;
					var st = el.scrollTop;
					var atTop = st <= 1;
					var atBottom = st >= maxScroll - 1;
					railScrollClip.setAttribute('data-edge-top', canScroll && !atTop ? '1' : '0');
					railScrollClip.setAttribute('data-edge-bottom', canScroll && !atBottom ? '1' : '0');
				}
				if (railScrollEl && railScrollClip) {
					railScrollEl.addEventListener('scroll', syncRailScrollEdges, { passive: true });
					window.addEventListener('resize', syncRailScrollEdges, { passive: true });
					if (typeof ResizeObserver !== 'undefined') {
						var roRailScroll = new ResizeObserver(syncRailScrollEdges);
						roRailScroll.observe(railScrollEl);
					}
					syncRailScrollEdges();
				}
				wireRailScrollbarOnScroll(railScrollEl);
				var railScrollAside = document.getElementById('doc-left-rail');
				if (railScrollAside && railScrollAside !== railScrollEl) {
					wireRailScrollbarOnScroll(railScrollAside);
				}

				var docRailNav = document.querySelector('.rail-nav');
				if (docRailNav) {
					docRailNav.addEventListener('click', function (e) {
						var btn = e.target && e.target.closest ? e.target.closest('.rail-nav__trigger') : null;
						if (!btn || !docRailNav.contains(btn)) return;
						var expanded = btn.getAttribute('aria-expanded') === 'true';
						var next = !expanded;
						btn.setAttribute('aria-expanded', next ? 'true' : 'false');
						var panelId = btn.getAttribute('aria-controls');
						var panel = panelId ? document.getElementById(panelId) : null;
						var section = btn.closest('.rail-nav__section');
						if (panel) panel.hidden = !next;
						if (section) section.setAttribute('data-state', next ? 'open' : 'closed');
						requestAnimationFrame(syncRailScrollEdges);
					});
				}

				/* 本页目录：与正文滚动同步；凡本节（标题至下一标题）与阅读视口相交则高亮，可多选（--top / --height 覆盖全部活动项） */
				var tocList = document.getElementById('doc-toc-list');
				var docMainEl = document.getElementById('main-content');
				if (tocList && docMainEl && docMainEl.classList.contains('doc-main')) {
					var tocLinks = tocList.querySelectorAll('a[href^="#"]');
					var tocRaf = null;
					function tocSync() {
						var idWanted = {};
						for (var ti = 0; ti < tocLinks.length; ti++) {
							var href = tocLinks[ti].getAttribute('href') || '';
							var tid = href.charAt(0) === '#' ? href.slice(1) : '';
							if (tid) idWanted[tid] = true;
						}
						var allHeads = docMainEl.querySelectorAll('h2[id], h3[id], h4[id]');
						var ordered = [];
						for (var hi = 0; hi < allHeads.length; hi++) {
							var he = allHeads[hi];
							if (idWanted[he.id]) ordered.push(he);
						}
						var scrollRootEl = docMainEl.closest('.doc-reading');
						var vpTop;
						var vpBottom;
						if (scrollRootEl) {
							var rr = scrollRootEl.getBoundingClientRect();
							vpTop = rr.top;
							vpBottom = rr.bottom;
						} else {
							vpTop = 0;
							vpBottom = window.innerHeight || document.documentElement.clientHeight || 0;
						}
						var mainBottom = docMainEl.getBoundingClientRect().bottom;
						var activeHeadEls = [];
						for (var oi = 0; oi < ordered.length; oi++) {
							var headEl = ordered[oi];
							var sectionTop = headEl.getBoundingClientRect().top;
							var nextHead = ordered[oi + 1];
							var sectionBottom = nextHead
								? nextHead.getBoundingClientRect().top
								: mainBottom;
							/* 本节与阅读视口在纵向上有交集即视为可见 */
							if (sectionBottom > vpTop && sectionTop < vpBottom) activeHeadEls.push(headEl);
						}
						for (var li = 0; li < tocLinks.length; li++) {
							tocLinks[li].classList.remove('is-active');
							tocLinks[li].removeAttribute('aria-current');
						}
						var minLiTop = null;
						var maxLiBottom = null;
						var firstAria = true;
						for (var ai = 0; ai < activeHeadEls.length; ai++) {
							var hid = activeHeadEls[ai].id;
							for (var lj = 0; lj < tocLinks.length; lj++) {
								var cand = tocLinks[lj];
								if ((cand.getAttribute('href') || '').replace(/^#/, '') !== hid) continue;
								cand.classList.add('is-active');
								if (firstAria) {
									cand.setAttribute('aria-current', 'location');
									firstAria = false;
								}
								var liNode = cand.closest('li');
								if (liNode) {
									var t = liNode.offsetTop;
									var b = t + liNode.offsetHeight;
									if (minLiTop === null || t < minLiTop) minLiTop = t;
									if (maxLiBottom === null || b > maxLiBottom) maxLiBottom = b;
								}
								break;
							}
						}
						if (minLiTop !== null && maxLiBottom !== null) {
							tocList.style.setProperty('--top', minLiTop + 'px');
							tocList.style.setProperty('--height', maxLiBottom - minLiTop + 'px');
						} else {
							tocList.style.setProperty('--top', '0px');
							tocList.style.setProperty('--height', '0px');
						}
					}
					function tocSchedule() {
						if (tocRaf) return;
						tocRaf = requestAnimationFrame(function () {
							tocRaf = null;
							tocSync();
						});
					}
					function tocScheduleSoon() {
						tocSchedule();
						requestAnimationFrame(function () {
							tocSchedule();
						});
						setTimeout(tocSchedule, 0);
						setTimeout(tocSchedule, 64);
					}
					var docScrollRoot = docMainEl.closest('.doc-reading');
					function tocBindScrollTargets(fn) {
						if (docScrollRoot) {
							docScrollRoot.addEventListener('scroll', fn, { passive: true });
							try {
								docScrollRoot.addEventListener('scrollend', fn, { passive: true });
							} catch (e) {}
						}
						/* 窄屏下由 body / document 滚动，与 .doc-reading 内滚动二选一 */
						window.addEventListener('scroll', fn, { passive: true });
					}
					tocBindScrollTargets(tocSchedule);
					window.addEventListener('resize', tocSchedule, { passive: true });
					window.addEventListener('hashchange', tocScheduleSoon, { passive: true });
					tocList.addEventListener('click', function (e) {
						var t = e.target;
						var a = t && t.closest ? t.closest('a[href^="#"]') : null;
						if (!a || !tocList.contains(a)) return;
						tocScheduleSoon();
					});
					tocSchedule();
				}
			})();
