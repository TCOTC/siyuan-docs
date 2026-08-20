import { shouldSuppressRailScrollbarTransient, syncRailScrollEdges } from '../doc-reading-sync';

const RAIL_SCROLLBAR_HIDE_MS = 1000;

function wireRailScrollbarOnScroll(el: Element | null, signal: AbortSignal): void {
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
		}, RAIL_SCROLLBAR_HIDE_MS);
	}
	scrollEl.addEventListener('scroll', showRailScrollbarTransient, { passive: true, signal });
}

/** 侧栏滚动条边缘数据属性与滚动时短暂显示滚动条 */
export function mountRailScrollWiring(signal: AbortSignal): void {
	const railScrollEl = document.querySelector('.rail-scroll');
	const railScrollClip = document.querySelector('[data-rail-scroll-clip]');
	if (railScrollEl && railScrollClip) {
		railScrollEl.addEventListener('scroll', () => syncRailScrollEdges(), { passive: true, signal });
		window.addEventListener('resize', () => syncRailScrollEdges(), { passive: true, signal });
		const roRailScroll = new ResizeObserver(() => syncRailScrollEdges());
		roRailScroll.observe(railScrollEl);
		signal.addEventListener(
			'abort',
			() => {
				roRailScroll.disconnect();
			},
			{ once: true },
		);
		syncRailScrollEdges();
	}
	wireRailScrollbarOnScroll(railScrollEl, signal);
	const railScrollAside = document.getElementById('doc-rail');
	if (railScrollAside && railScrollAside !== railScrollEl) {
		wireRailScrollbarOnScroll(railScrollAside, signal);
	}
}
