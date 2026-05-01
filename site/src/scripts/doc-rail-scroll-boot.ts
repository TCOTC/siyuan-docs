/**
 * 侧栏「当前文档」在 `.rail-scroll` 内纵向居中首帧滚动。
 * 与 `doc-reading-sync.applyRailActiveNavScroll` 同算法；经 `doc-window-runtime` 与主包共用计数。
 * 须由 `Shell.astro` 以 `?inline-bundle` 紧接 `.rail-scroll` 后内联同步执行，避免外链模块晚于首帧、先画 scrollTop=0 再瞬移。
 */
import {
	bumpProgrammaticRailScrollDepth,
	scheduleReleaseProgrammaticRailScrollDepth,
	setRailScrollBootSuppress,
} from './lib/doc-window-runtime';

(function docRailScrollBoot(): void {
	setRailScrollBootSuppress(true);
	const railMaybe = document.querySelector('.rail-scroll');
	const clipMaybe = document.querySelector('[data-rail-scroll-clip]');
	if (!(railMaybe instanceof HTMLElement) || !(clipMaybe instanceof HTMLElement)) return;
	const railEl: HTMLElement = railMaybe;
	const clipEl: HTMLElement = clipMaybe;

	let target: Element | null = null;
	for (const el of railEl.querySelectorAll('.rail-nav__link.is-active')) {
		const r = el.getBoundingClientRect();
		if (r.width > 0 && r.height > 0) {
			target = el;
			break;
		}
	}

	function syncEdges(): void {
		const maxScroll = Math.max(0, railEl.scrollHeight - railEl.clientHeight);
		const canScroll = maxScroll > 2;
		const st = railEl.scrollTop;
		const atTop = st <= 1;
		const atBottom = st >= maxScroll - 1;
		clipEl.setAttribute('data-edge-top', canScroll && !atTop ? '1' : '0');
		clipEl.setAttribute('data-edge-bottom', canScroll && !atBottom ? '1' : '0');
	}

	function applyScroll(): void {
		if (!target || railEl.clientHeight <= 1) {
			syncEdges();
			return;
		}
		const maxScroll = Math.max(0, railEl.scrollHeight - railEl.clientHeight);
		if (maxScroll <= 0) {
			syncEdges();
			return;
		}
		bumpProgrammaticRailScrollDepth();
		try {
			const rr = railEl.getBoundingClientRect();
			const tr = target.getBoundingClientRect();
			const yCenterInContent = railEl.scrollTop + (tr.top - rr.top) + tr.height / 2;
			let nextTop = yCenterInContent - railEl.clientHeight / 2;
			nextTop = Math.min(Math.max(0, nextTop), maxScroll);
			railEl.scrollTop = nextTop;
			syncEdges();
		} finally {
			scheduleReleaseProgrammaticRailScrollDepth();
		}
	}

	applyScroll();
	requestAnimationFrame(applyScroll);
})();
