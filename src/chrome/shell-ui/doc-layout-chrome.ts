import { DOC_SCROLL_SESSION_PREFIX } from '../../lib/docScrollSession';
import { safeSessionSet } from '../safe-storage';
import { tocSync } from '../doc-reading-sync';
import { setRailScrollBootSuppress } from '../doc-window-runtime';

function scheduleEndDocRailScrollBoot(signal: AbortSignal): void {
	let ended = false;
	const finish = (): void => {
		if (ended) return;
		ended = true;
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
					window.addEventListener('load', () => resolve(), { once: true, signal });
				});
	void Promise.all([loadPromise, document.fonts.ready]).then(finish).catch(finish);
	window.setTimeout(finish, 2500);
}

/** 文档页面包屑回顶、侧栏滚动 boot 结束 */
export function mountDocLayoutChrome(signal: AbortSignal): void {
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
			{ passive: false, signal },
		);
	}
	scheduleEndDocRailScrollBoot(signal);
}
