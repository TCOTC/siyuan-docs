import { onMounted, onUnmounted, type Ref } from 'vue';
import { scheduleTocSyncSoon, tocSync } from '../lib/tocSync';

/** 本页目录与正文滚动同步 */
export function useTocInPage(tocList: Ref<HTMLElement | null>, main: Ref<HTMLElement | null>): void {
	const ac = new AbortController();
	let tocRaf: number | null = null;
	onMounted(() => {
		const list = tocList.value;
		const mainEl = main.value;
		if (!list || !mainEl || !mainEl.classList.contains('read-main')) return;

		const { signal } = ac;
		function tocSchedule(): void {
			if (tocRaf != null) return;
			tocRaf = requestAnimationFrame(() => {
				tocRaf = null;
				tocSync();
			});
		}
		const docScrollRoot = mainEl.closest('.read');
		docScrollRoot?.addEventListener('scroll', tocSchedule, { passive: true, signal });
		docScrollRoot?.addEventListener('scrollend', tocSchedule, { passive: true, signal });
		window.addEventListener('scroll', tocSchedule, { passive: true, signal });
		window.addEventListener('resize', tocSchedule, { passive: true, signal });
		window.addEventListener('hashchange', scheduleTocSyncSoon, { passive: true, signal });
		list.addEventListener(
			'click',
			(e) => {
				const t = e.target;
				const a = t instanceof Element ? t.closest('a[href^="#"]') : null;
				if (!a || !list.contains(a)) return;
				scheduleTocSyncSoon();
			},
			{ signal },
		);
		tocSync();
		if (document.readyState === 'complete') {
			requestAnimationFrame(() => {
				tocSync();
			});
		} else {
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
	});
	onUnmounted(() => {
		if (tocRaf != null) cancelAnimationFrame(tocRaf);
		ac.abort();
	});
}
