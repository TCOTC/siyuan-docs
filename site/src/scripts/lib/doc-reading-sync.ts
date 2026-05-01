/**
 * 侧栏滚动边缘与本页目录同步（与首帧 bootstrap 共用，避免与 shell-ui 重复实现分叉）。
 */

export function syncRailScrollEdges(): void {
	const railScrollEl = document.querySelector('.rail-scroll');
	const railScrollClip = document.querySelector('[data-rail-scroll-clip]');
	if (!railScrollEl || !railScrollClip) return;
	const el = railScrollEl;
	const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
	const canScroll = maxScroll > 2;
	const st = el.scrollTop;
	const atTop = st <= 1;
	const atBottom = st >= maxScroll - 1;
	railScrollClip.setAttribute('data-edge-top', canScroll && !atTop ? '1' : '0');
	railScrollClip.setAttribute('data-edge-bottom', canScroll && !atBottom ? '1' : '0');
}

function bumpProgrammaticRailScrollDepth(): void {
	window.__siyuanRailScrollProg = (window.__siyuanRailScrollProg ?? 0) + 1;
}

function releaseProgrammaticRailScrollDepth(): void {
	window.__siyuanRailScrollProg = Math.max(0, (window.__siyuanRailScrollProg ?? 0) - 1);
}

function scheduleReleaseProgrammaticRailScrollDepth(): void {
	queueMicrotask(() => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				releaseProgrammaticRailScrollDepth();
			});
		});
	});
}

/** 自动定位侧栏滚动时为 true；供 shell-ui 抑制滚动条短暂显隐 */
export function isProgrammaticRailScroll(): boolean {
	return (window.__siyuanRailScrollProg ?? 0) > 0;
}

/** 程序化滚动或首屏 boot（见 `doc-rail-scroll-boot`）期间不点亮侧栏滚动条 */
export function shouldSuppressRailScrollbarTransient(): boolean {
	return (
		isProgrammaticRailScroll() ||
		document.documentElement.classList.contains('doc-rail-scroll-boot')
	);
}

/**
 * 仅操作 `.rail-scroll` 的 scrollTop，避免 `scrollIntoView` 连带滚动页面主栏或其它祖先。
 * 目录末尾项会钳制到 maxScroll，保证当前链接落在可视区内。
 */
export function applyRailActiveNavScroll(rail: HTMLElement, target: HTMLElement): void {
	const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
	if (maxScroll <= 0 || rail.clientHeight <= 0) return;
	bumpProgrammaticRailScrollDepth();
	try {
		const rr = rail.getBoundingClientRect();
		const tr = target.getBoundingClientRect();
		const yCenterInContent =
			rail.scrollTop + (tr.top - rr.top) + tr.height / 2;
		let nextTop = yCenterInContent - rail.clientHeight / 2;
		nextTop = Math.min(Math.max(0, nextTop), maxScroll);
		rail.scrollTop = nextTop;
	} finally {
		scheduleReleaseProgrammaticRailScrollDepth();
	}
}

/**
 * 将侧栏文档目录中当前页链接滚入 `.rail-scroll` 可视区域（尽量居中；双语文档栈仅处理可见的一项）。
 * 进入文档时的初定位由 `Shell.astro` 内联脚本尽早执行；此处供窄屏打开抽屉等后续场景。
 */
export function scrollActiveRailNavIntoView(): void {
	const railScroll = document.querySelector('.rail-scroll');
	if (!(railScroll instanceof HTMLElement)) return;
	const actives = railScroll.querySelectorAll('.rail-nav__link.is-active');
	let target: HTMLElement | null = null;
	for (let i = 0; i < actives.length; i++) {
		const el = actives[i];
		if (!(el instanceof HTMLElement)) continue;
		const r = el.getBoundingClientRect();
		if (r.width > 0 && r.height > 0) {
			target = el;
			break;
		}
	}
	if (!target) return;
	const railEl = railScroll;
	const targetEl = target;
	const run = (): void => {
		applyRailActiveNavScroll(railEl, targetEl);
	};
	run();
	if (typeof requestAnimationFrame === 'function') {
		requestAnimationFrame(run);
	}
}

/** 与文档视口相交的标题对应 TOC 高亮与指示条位置（--top / --height） */
export function tocSync(): void {
	const tocList = document.getElementById('doc-toc-list');
	const docMainEl = document.getElementById('main-content');
	if (!tocList || !docMainEl || !docMainEl.classList.contains('doc-main')) return;
	const tocLinks = tocList.querySelectorAll('a[href^="#"]');
	const idWanted: Record<string, boolean> = {};
	for (let ti = 0; ti < tocLinks.length; ti++) {
		const href = tocLinks[ti].getAttribute('href') || '';
		const tid = href.charAt(0) === '#' ? href.slice(1) : '';
		if (tid) idWanted[tid] = true;
	}
	const allHeads = docMainEl.querySelectorAll('h2[id], h3[id], h4[id]');
	const ordered: HTMLElement[] = [];
	for (let hi = 0; hi < allHeads.length; hi++) {
		const he = allHeads[hi] as HTMLElement;
		if (idWanted[he.id]) ordered.push(he);
	}
	const scrollRootEl = docMainEl.closest('.doc-reading');
	let vpTop: number;
	let vpBottom: number;
	if (scrollRootEl) {
		const rr = scrollRootEl.getBoundingClientRect();
		vpTop = rr.top;
		vpBottom = rr.bottom;
	} else {
		vpTop = 0;
		vpBottom = window.innerHeight || document.documentElement.clientHeight || 0;
	}
	const mainBottom = docMainEl.getBoundingClientRect().bottom;
	const activeHeadEls: HTMLElement[] = [];
	for (let oi = 0; oi < ordered.length; oi++) {
		const headEl = ordered[oi];
		const sectionTop = headEl.getBoundingClientRect().top;
		const nextHead = ordered[oi + 1];
		const sectionBottom = nextHead ? nextHead.getBoundingClientRect().top : mainBottom;
		if (sectionBottom > vpTop && sectionTop < vpBottom) activeHeadEls.push(headEl);
	}
	for (let li = 0; li < tocLinks.length; li++) {
		tocLinks[li].classList.remove('is-active');
		tocLinks[li].removeAttribute('aria-current');
	}
	let minLiTop: number | null = null;
	let maxLiBottom: number | null = null;
	let firstAria = true;
	for (let ai = 0; ai < activeHeadEls.length; ai++) {
		const hid = activeHeadEls[ai].id;
		for (let lj = 0; lj < tocLinks.length; lj++) {
			const cand = tocLinks[lj];
			if ((cand.getAttribute('href') || '').replace(/^#/, '') !== hid) continue;
			cand.classList.add('is-active');
			if (firstAria) {
				cand.setAttribute('aria-current', 'location');
				firstAria = false;
			}
			const liNode = cand.closest('li');
			if (liNode) {
				const t = liNode.offsetTop;
				const b = t + liNode.offsetHeight;
				if (minLiTop === null || t < minLiTop) minLiTop = t;
				if (maxLiBottom === null || b > maxLiBottom) maxLiBottom = b;
			}
			break;
		}
	}
	if (minLiTop !== null && maxLiBottom !== null) {
		tocList.style.setProperty('--top', `${minLiTop}px`);
		tocList.style.setProperty('--height', `${maxLiBottom - minLiTop}px`);
	} else {
		tocList.style.setProperty('--top', '0px');
		tocList.style.setProperty('--height', '0px');
	}
}

declare global {
	interface Window {
		__siyuanDocsTocBootstrapped?: boolean;
	}
}
