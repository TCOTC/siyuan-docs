import { shouldSuppressRailScrollbarTransient, syncRailScrollEdges } from '../doc-reading-sync';

const RAIL_SCROLLBAR_HIDE_MS = 1000;

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
		}, RAIL_SCROLLBAR_HIDE_MS);
	}
	scrollEl.addEventListener('scroll', showRailScrollbarTransient, { passive: true });
}

/** 侧栏滚动条边缘数据属性与滚动时短暂显示滚动条 */
export function mountRailScrollWiring(): void {
	const railScrollEl = document.querySelector('.rail-scroll');
	const railScrollClip = document.querySelector('[data-rail-scroll-clip]');
	if (railScrollEl && railScrollClip) {
		railScrollEl.addEventListener('scroll', () => syncRailScrollEdges(), { passive: true });
		window.addEventListener('resize', () => syncRailScrollEdges(), { passive: true });
		const roRailScroll = new ResizeObserver(() => syncRailScrollEdges());
		roRailScroll.observe(railScrollEl);
		syncRailScrollEdges();
	}
	wireRailScrollbarOnScroll(railScrollEl);
	const railScrollAside = document.getElementById('doc-left-rail');
	if (railScrollAside && railScrollAside !== railScrollEl) {
		wireRailScrollbarOnScroll(railScrollAside);
	}
}
