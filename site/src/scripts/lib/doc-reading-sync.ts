/**
 * 侧栏滚动边缘与本页目录同步（与首帧 bootstrap 共用，避免与 shell-ui 重复实现分叉）。
 */

/** 避免正文滚动时每个 rAF 都重算大纲 scrollTop；仅在高亮集合变化时自动滚大纲 */
let tocActiveHeadSig = '';
let tocSyncLastViewportH = 0;

function animateTocRailScrollTo(tocRail: HTMLElement, nextTop: number): void {
	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	const target = Math.min(Math.max(0, nextTop), maxScroll);
	tocRail.scrollTop = target;
}

function scrollTocRailCenterOnActiveChange(
	tocList: HTMLElement,
	activeHeadEls: HTMLElement[],
): void {
	if (typeof window === 'undefined' || activeHeadEls.length === 0) return;
	if (!window.matchMedia('(min-width: 1000px)').matches) return;
	const tocRail = document.querySelector('.toc-rail');
	if (!(tocRail instanceof HTMLElement)) return;
	if (tocRail.getBoundingClientRect().height < 1) return;

	const midIdx = Math.floor((activeHeadEls.length - 1) / 2);
	const midId = activeHeadEls[midIdx].id;
	let target: HTMLElement | null = null;
	const links = tocList.querySelectorAll('a[href^="#"]');
	for (let i = 0; i < links.length; i++) {
		const a = links[i];
		const raw = (a.getAttribute('href') || '').replace(/^#/, '');
		if (raw === midId) {
			target = a as HTMLElement;
			break;
		}
	}
	if (!target) return;

	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	if (maxScroll <= 0) return;

	const tr = target.getBoundingClientRect();
	const windowMid =
		(window.innerHeight || document.documentElement.clientHeight || 0) / 2;
	const linkMidViewport = tr.top + tr.height / 2;
	/* 使该项垂直中心尽量落在视口垂直中线（阅读区意义上的「文档中部」） */
	let nextTop = tocRail.scrollTop + (linkMidViewport - windowMid);
	nextTop = Math.min(Math.max(0, nextTop), maxScroll);
	animateTocRailScrollTo(tocRail, nextTop);
}

/**
 * 指示条画在 `tocList`（`position: relative`）上；用相对列表的视口坐标，避免 `li.offsetTop` 在侧栏 `fixed` 等情况下 offsetParent 非 `ul` 导致 `--top` / `--height` 大幅错位。
 */
function setTocListIndicatorFromLiNodes(tocList: HTMLElement, liNodes: HTMLElement[]): void {
	if (liNodes.length === 0) {
		tocList.style.setProperty('--top', '0px');
		tocList.style.setProperty('--height', '0px');
		return;
	}
	const listR = tocList.getBoundingClientRect();
	let minTop = Infinity;
	let maxBottom = -Infinity;
	for (let i = 0; i < liNodes.length; i++) {
		const liR = liNodes[i].getBoundingClientRect();
		const t = liR.top - listR.top;
		const b = liR.bottom - listR.top;
		if (t < minTop) minTop = t;
		if (b > maxBottom) maxBottom = b;
	}
	const topPx = Math.round(minTop);
	const hPx = Math.round(Math.max(0, maxBottom - minTop));
	tocList.style.setProperty('--top', `${topPx}px`);
	tocList.style.setProperty('--height', `${hPx}px`);
}

/**
 * 解码后的 `location.hash` 片段（不含 `#`），无 hash 时返回 `null`。
 */
export function getDecodedLocationHashFragment(): string | null {
	if (typeof window === 'undefined') return null;
	const raw = window.location.hash.replace(/^#/, '');
	if (!raw) return null;
	try {
		return decodeURIComponent(raw);
	} catch {
		return raw;
	}
}

/**
 * 宽屏固定本页大纲：将对应标题的链接滚入 `.toc-rail` 视区并更新指示条与 `is-active`（与 `tocSync` 中单目标对齐算法一致）。
 * 在浏览器完成锚点定位（或用户滚动）之后调用；供 `doc-shell-bootstrap` 与正文锚点同步，避免首帧大纲停在顶部再跳变。
 */
export function applyTocRailPinnedLayoutForHeadingId(headingId: string): boolean {
	if (typeof window === 'undefined' || typeof document === 'undefined') return false;
	if (!window.matchMedia('(min-width: 1000px)').matches) return false;
	const tocList = document.getElementById('doc-toc-list');
	const tocRail = document.querySelector('.toc-rail');
	if (!tocList || !(tocRail instanceof HTMLElement)) return false;
	if (tocRail.getBoundingClientRect().height < 1) return false;

	const links = tocList.querySelectorAll('a[href^="#"]');
	let target: HTMLElement | null = null;
	for (let i = 0; i < links.length; i++) {
		const a = links[i];
		const raw = (a.getAttribute('href') || '').replace(/^#/, '');
		if (raw === headingId) {
			target = a as HTMLElement;
			break;
		}
	}
	if (!target) return false;

	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	const tr = target.getBoundingClientRect();
	const windowMid =
		(window.innerHeight || document.documentElement.clientHeight || 0) / 2;
	const linkMidViewport = tr.top + tr.height / 2;
	let nextTop = tocRail.scrollTop + (linkMidViewport - windowMid);
	nextTop = Math.min(Math.max(0, nextTop), maxScroll);
	tocRail.scrollTop = nextTop;

	for (let li = 0; li < links.length; li++) {
		links[li].classList.remove('is-active');
		links[li].removeAttribute('aria-current');
	}
	target.classList.add('is-active');
	target.setAttribute('aria-current', 'location');

	const liNode = target.closest('li');
	if (liNode instanceof HTMLElement) {
		setTocListIndicatorFromLiNodes(tocList, [liNode]);
	}
	return true;
}

/**
 * 将主栏 `.doc-center` 的视口水平 inset、`.content-head` 高度、宽屏固定 TOC 的 left 写入 CSS 变量。
 * 供 `shell-ui` 与首屏内联脚本使用，避免 fixed 顶栏在 deferred 模块执行前以 inset 0 铺满视口再跳变。
 */
export function syncDocOverlayLayoutMetrics(): void {
	if (typeof document === 'undefined' || typeof window === 'undefined') return;
	const root = document.documentElement;
	const contentHeadEl = document.querySelector('.content-head');
	if (contentHeadEl instanceof HTMLElement) {
		try {
			const h = Math.ceil(contentHeadEl.getBoundingClientRect().height);
			root.style.setProperty('--doc-overlay-top', `${h}px`);
		} catch {
			/* ignore */
		}
	}
	const docCenterEl = document.querySelector('.doc-center');
	if (docCenterEl instanceof HTMLElement) {
		try {
			const r = docCenterEl.getBoundingClientRect();
			const vw = window.innerWidth || document.documentElement.clientWidth || 0;
			root.style.setProperty('--doc-content-head-inset-left', `${r.left}px`);
			root.style.setProperty(
				'--doc-content-head-inset-right',
				`${Math.max(0, vw - r.right)}px`,
			);
		} catch {
			/* ignore */
		}
	}
	const tocRailEl = document.querySelector('.toc-rail');
	try {
		if (
			docCenterEl instanceof HTMLElement &&
			tocRailEl instanceof HTMLElement &&
			window.matchMedia('(min-width: 1000px)').matches
		) {
			const tw = tocRailEl.offsetWidth;
			if (tw > 0) {
				const dc = docCenterEl.getBoundingClientRect();
				root.style.setProperty('--doc-toc-fixed-left', `${Math.round(dc.right - tw)}px`);
			} else {
				root.style.removeProperty('--doc-toc-fixed-left');
			}
		} else {
			root.style.removeProperty('--doc-toc-fixed-left');
		}
	} catch {
		/* ignore */
	}
}

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

/** 阅读线：相对顶栏底边下移量占阅读区高度比例（取 clamp），线越靠上越晚切换到下一节 */
const TOC_READING_LINE_MIN_RATIO = 0.14;
const TOC_READING_LINE_MAX_RATIO = 0.28;
const TOC_READING_LINE_MIN_PX = 48;

/**
 * 当前阅读节：取「标题顶边 ≤ 阅读线」的最后一个标题（单节高亮），避免区间与视口求交时相邻节同时命中或边界过早切换。
 */
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
	const docCenter = docMainEl.closest('.doc-center');
	const contentHead =
		docCenter?.querySelector(':scope > .content-head') ?? null;
	let vpTop: number;
	let vpBottom: number;
	if (contentHead instanceof HTMLElement) {
		const hr = contentHead.getBoundingClientRect();
		vpTop = hr.bottom;
	} else {
		vpTop = 0;
	}
	vpBottom = window.innerHeight || document.documentElement.clientHeight || 0;
	const bandH = Math.max(1, vpBottom - vpTop);
	const lineOffset = Math.min(
		Math.max(bandH * TOC_READING_LINE_MIN_RATIO, TOC_READING_LINE_MIN_PX),
		bandH * TOC_READING_LINE_MAX_RATIO,
	);
	const readingLineY = vpTop + lineOffset;

	let activeIndex = -1;
	for (let i = 0; i < ordered.length; i++) {
		if (ordered[i].getBoundingClientRect().top <= readingLineY) activeIndex = i;
	}

	let activeHeadEls: HTMLElement[];
	if (activeIndex >= 0) activeHeadEls = [ordered[activeIndex]];
	else if (ordered.length > 0) activeHeadEls = [ordered[0]];
	else activeHeadEls = [];

	for (let li = 0; li < tocLinks.length; li++) {
		tocLinks[li].classList.remove('is-active');
		tocLinks[li].removeAttribute('aria-current');
	}
	const liNodesForIndicator: HTMLElement[] = [];
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
			if (liNode instanceof HTMLElement && !liNodesForIndicator.includes(liNode)) {
				liNodesForIndicator.push(liNode);
			}
			break;
		}
	}
	setTocListIndicatorFromLiNodes(tocList, liNodesForIndicator);

	const sig =
		activeHeadEls.length > 0 ? activeHeadEls.map((h) => h.id).join('\u0001') : '';
	const vph = window.innerHeight || document.documentElement.clientHeight || 0;
	const viewportChanged =
		tocSyncLastViewportH > 0 && vph > 0 && vph !== tocSyncLastViewportH;
	tocSyncLastViewportH = vph;

	const sigChanged = sig !== tocActiveHeadSig;
	if (sigChanged) tocActiveHeadSig = sig;

	if (activeHeadEls.length > 0 && (sigChanged || viewportChanged)) {
		const heads = activeHeadEls.slice();
		scrollTocRailCenterOnActiveChange(tocList, heads);
	} else if (sigChanged && activeHeadEls.length === 0) {
		if (typeof window !== 'undefined' && window.matchMedia('(min-width: 1000px)').matches) {
			const tocRailClear = document.querySelector('.toc-rail');
			if (tocRailClear instanceof HTMLElement) animateTocRailScrollTo(tocRailClear, 0);
		}
	}
}

declare global {
	interface Window {
		__siyuanDocsTocBootstrapped?: boolean;
	}
}
