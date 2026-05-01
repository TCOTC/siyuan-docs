/**
 * 与 doc-reading-sync.applyRailActiveNavScroll 同算法；window.__siyuanRailScrollProg 与 TS 共用，避免自动滚动触发 rail-scrollbar--visible
 */
(function docRailScrollBoot(): void {
	document.documentElement.classList.add('doc-rail-scroll-boot');
	const rail = document.querySelector('.rail-scroll') as HTMLElement | null;
	const clip = document.querySelector('[data-rail-scroll-clip]') as HTMLElement | null;
	if (!rail || !clip) return;
	const railEl = rail;
	const clipEl = clip;
	const links = railEl.querySelectorAll('.rail-nav__link.is-active');
	let target: Element | null = null;
	for (let i = 0; i < links.length; i++) {
		const el = links[i];
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
	function bumpProgRailScroll(): void {
		window.__siyuanRailScrollProg = (window.__siyuanRailScrollProg || 0) + 1;
	}
	function releaseProgRailScroll(): void {
		queueMicrotask(() => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					window.__siyuanRailScrollProg = Math.max(0, (window.__siyuanRailScrollProg || 0) - 1);
				});
			});
		});
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
		bumpProgRailScroll();
		try {
			const rr = railEl.getBoundingClientRect();
			const tr = target.getBoundingClientRect();
			const yCenterInContent = railEl.scrollTop + (tr.top - rr.top) + tr.height / 2;
			let nextTop = yCenterInContent - railEl.clientHeight / 2;
			if (nextTop < 0) nextTop = 0;
			else if (nextTop > maxScroll) nextTop = maxScroll;
			railEl.scrollTop = nextTop;
			syncEdges();
		} finally {
			releaseProgRailScroll();
		}
	}
	applyScroll();
	if (typeof requestAnimationFrame === 'function') {
		requestAnimationFrame(applyScroll);
	}
})();
