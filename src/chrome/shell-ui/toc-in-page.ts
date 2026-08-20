import { scheduleTocSyncSoon, tocSync } from '../doc-reading-sync';

/** 本页目录与正文滚动同步；首帧 tocSync 由 mountDocChrome 已执行 */
export function mountTocInPage(signal: AbortSignal): void {
	const tocList = document.getElementById('doc-toc-list');
	const docMainEl = document.getElementById('main-content');
	if (!tocList || !docMainEl || !docMainEl.classList.contains('read-main')) return;

	const mainContent = docMainEl;
	let tocRaf: number | null = null;
	function tocSchedule(): void {
		if (tocRaf != null) return;
		tocRaf = requestAnimationFrame(() => {
			tocRaf = null;
			tocSync();
		});
	}
	function tocBindScrollTargets(fn: () => void): void {
		const docScrollRoot = mainContent.closest('.read');
		docScrollRoot?.addEventListener('scroll', fn, { passive: true, signal });
		docScrollRoot?.addEventListener('scrollend', fn, { passive: true, signal });
		window.addEventListener('scroll', fn, { passive: true, signal });
	}
	tocBindScrollTargets(tocSchedule);
	window.addEventListener('resize', tocSchedule, { passive: true, signal });
	window.addEventListener('hashchange', scheduleTocSyncSoon, { passive: true, signal });
	tocList.addEventListener(
		'click',
		(e) => {
			const t = e.target;
			const a = t instanceof Element ? t.closest('a[href^="#"]') : null;
			if (!a || !tocList.contains(a)) return;
			scheduleTocSyncSoon();
		},
		{ signal },
	);
	window.addEventListener(
		'load',
		() => {
			requestAnimationFrame(() => {
				tocSync();
			});
		},
		{ once: true, signal },
	);
}
