import { onMounted, onUnmounted, type Ref } from 'vue';

const RAIL_SCROLLBAR_HIDE_MS = 1000;

/** 侧栏滚动边缘、当前项滚入可视区，以及滚动时短暂显示滚动条（仅文档布局使用） */
export function useRailScroll(
	railScroll: Ref<HTMLElement | null>,
	railClip: Ref<HTMLElement | null>,
	railAside: Ref<HTMLElement | null>,
): {
	syncRailScrollEdges: () => void;
	scrollActiveRailNavIntoView: () => void;
} {
	/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
	let programmaticRailScrollDepth = 0;

	function bumpProgrammaticRailScrollDepth(): void {
		programmaticRailScrollDepth += 1;
		queueMicrotask(() => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					programmaticRailScrollDepth = Math.max(0, programmaticRailScrollDepth - 1);
				});
			});
		});
	}

	function syncRailScrollEdges(): void {
		const el = railScroll.value;
		const clip = railClip.value;
		if (!el || !clip) return;
		const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
		const canScroll = maxScroll > 2;
		const st = el.scrollTop;
		clip.setAttribute('data-edge-top', canScroll && st > 1 ? '1' : '0');
		clip.setAttribute('data-edge-bottom', canScroll && st < maxScroll - 1 ? '1' : '0');
	}

	function applyRailActiveNavScroll(rail: HTMLElement, target: HTMLElement): void {
		const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
		if (maxScroll <= 0 || rail.clientHeight <= 0) return;
		bumpProgrammaticRailScrollDepth();
		const rr = rail.getBoundingClientRect();
		const tr = target.getBoundingClientRect();
		const yCenterInContent = rail.scrollTop + (tr.top - rr.top) + tr.height / 2;
		rail.scrollTop = Math.min(Math.max(0, yCenterInContent - rail.clientHeight / 2), maxScroll);
	}

	function scrollActiveRailNavIntoView(): void {
		const rail = railScroll.value;
		if (!rail) return;
		let target: HTMLElement | null = null;
		for (const el of rail.querySelectorAll('.rail-nav__link.is-active')) {
			if (!(el instanceof HTMLElement)) continue;
			const r = el.getBoundingClientRect();
			if (r.width > 0 && r.height > 0) {
				target = el;
				break;
			}
		}
		if (!target) return;
		const activeLink = target;
		const run = (): void => {
			applyRailActiveNavScroll(rail, activeLink);
		};
		run();
		requestAnimationFrame(run);
	}

	function wireRailScrollbarOnScroll(el: Element | null, signal: AbortSignal): void {
		if (!el) return;
		const scrollEl = el;
		let hideTimer: number | null = null;
		function showRailScrollbarTransient(): void {
			if (programmaticRailScrollDepth > 0) return;
			scrollEl.classList.add('rail-scrollbar--visible');
			if (hideTimer) window.clearTimeout(hideTimer);
			hideTimer = window.setTimeout(() => {
				hideTimer = null;
				scrollEl.classList.remove('rail-scrollbar--visible');
			}, RAIL_SCROLLBAR_HIDE_MS);
		}
		scrollEl.addEventListener('scroll', showRailScrollbarTransient, { passive: true, signal });
	}

	const ac = new AbortController();
	onMounted(() => {
		const { signal } = ac;
		const scrollEl = railScroll.value;
		const clipEl = railClip.value;
		if (scrollEl && clipEl) {
			const sync = (): void => syncRailScrollEdges();
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
	return { syncRailScrollEdges, scrollActiveRailNavIntoView };
}
