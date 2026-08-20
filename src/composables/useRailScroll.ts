import { onMounted, onUnmounted, type Ref } from 'vue';
import {
	shouldSuppressRailScrollbarTransient,
	syncRailScrollEdges,
} from '../lib/railScroll';

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
export function useRailScroll(
	railScroll: Ref<HTMLElement | null>,
	railClip: Ref<HTMLElement | null>,
	railAside: Ref<HTMLElement | null>,
): void {
	const ac = new AbortController();
	onMounted(() => {
		const { signal } = ac;
		const scrollEl = railScroll.value;
		const clipEl = railClip.value;
		if (scrollEl && clipEl) {
			const sync = (): void => syncRailScrollEdges(scrollEl, clipEl);
			scrollEl.addEventListener('scroll', sync, { passive: true, signal });
			window.addEventListener('resize', sync, { passive: true, signal });
			const roRailScroll = new ResizeObserver(sync);
			roRailScroll.observe(scrollEl);
			signal.addEventListener(
				'abort',
				() => {
					roRailScroll.disconnect();
				},
				{ once: true },
			);
			sync();
		}
		wireRailScrollbarOnScroll(scrollEl, signal);
		const aside = railAside.value;
		if (aside && aside !== scrollEl) {
			wireRailScrollbarOnScroll(aside, signal);
		}
	});
	onUnmounted(() => {
		ac.abort();
	});
}
