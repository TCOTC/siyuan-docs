import { consumeShellBootstrapRanTocSync } from '../doc-shell-toc-handshake';
import { tocSync } from '../doc-reading-sync';

/** 本页目录与正文滚动同步、hash 变化与 load 后再同步 */
export function mountTocInPage(): void {
	const tocList = document.getElementById('doc-toc-list');
	const docMainEl = document.getElementById('main-content');
	if (!tocList || !docMainEl || !docMainEl.classList.contains('doc-main')) return;

	const mainContent = docMainEl;
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
		const docScrollRoot = mainContent.closest('.doc-reading');
		docScrollRoot?.addEventListener('scroll', fn, { passive: true });
		docScrollRoot?.addEventListener('scrollend', fn, { passive: true });
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
	if (!consumeShellBootstrapRanTocSync()) {
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
