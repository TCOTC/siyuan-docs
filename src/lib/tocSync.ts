/**
 * 本页目录：阅读线高亮、指示条与大纲滚动同步。
 */

/** 避免正文滚动时每个 rAF 都重算大纲 scrollTop；仅在高亮集合变化时自动滚大纲 */
let tocActiveHeadSig = '';
let tocSyncLastViewportH = 0;

function tocRailScrollShouldBeInstant(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

type TocListIndicatorPx = { top: number; height: number };

let tocRailMotionRaf = 0;
let tocRailMotionToken = 0;
let tocRailMotionBusy = false;

function stopTocRailMotionRaf(): void {
	if (tocRailMotionRaf !== 0) {
		cancelAnimationFrame(tocRailMotionRaf);
		tocRailMotionRaf = 0;
	}
	tocRailMotionBusy = false;
}

/** 切页后当作冷启动，避免指示条从上一页位置滑入 */
export function resetTocSyncState(): void {
	tocActiveHeadSig = '';
	tocSyncLastViewportH = 0;
	stopTocRailMotionRaf();
}

function easeOutCubic(t: number): number {
	const u = 1 - t;
	return 1 - u * u * u;
}

/** 与 `scrollTop` 插值同一时长、同一缓出曲线，避免指示条与侧栏滚动速度不一致 */
const TOC_RAIL_SYNC_MS_MIN = 200;
const TOC_RAIL_SYNC_MS_MAX = 480;
const TOC_RAIL_SYNC_MS_PER_PX = 0.42;

function startTocRailScrollAndIndicatorSync(
	tocRail: HTMLElement,
	tocList: HTMLElement,
	fromScroll: number,
	toScroll: number,
	fromInd: TocListIndicatorPx,
	toInd: TocListIndicatorPx,
	liNodesForIndicatorFinish: HTMLElement[],
): void {
	stopTocRailMotionRaf();
	tocRailMotionToken++;
	const tk = tocRailMotionToken;

	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	const toS = Math.min(Math.max(0, toScroll), maxScroll);
	const fromS = fromScroll;

	const finish = (): void => {
		tocRail.scrollTop = toS;
		setTocListIndicatorFromLiNodes(tocList, liNodesForIndicatorFinish);
		tocRailMotionBusy = false;
	};

	if (tocRailScrollShouldBeInstant()) {
		finish();
		return;
	}

	const dScroll = Math.abs(toS - fromS);
	const dTop = Math.abs(toInd.top - fromInd.top);
	const dH = Math.abs(toInd.height - fromInd.height);
	const pixelDrive = Math.max(dScroll, dTop * 0.9, dH * 0.9);
	const duration = Math.min(
		TOC_RAIL_SYNC_MS_MAX,
		Math.max(TOC_RAIL_SYNC_MS_MIN, pixelDrive * TOC_RAIL_SYNC_MS_PER_PX),
	);

	if (duration < 1 || (dScroll < 0.5 && dTop < 0.5 && dH < 0.5)) {
		finish();
		return;
	}

	tocRailMotionBusy = true;
	const t0 = performance.now();
	const step = (now: number): void => {
		if (tk !== tocRailMotionToken) return;
		const u = Math.min(1, (now - t0) / duration);
		const e = easeOutCubic(u);
		tocRail.scrollTop = fromS + (toS - fromS) * e;
		applyTocListIndicatorPx(tocList, {
			top: fromInd.top + (toInd.top - fromInd.top) * e,
			height: fromInd.height + (toInd.height - fromInd.height) * e,
		});
		if (u < 1) {
			tocRailMotionRaf = requestAnimationFrame(step);
		} else {
			tocRailMotionRaf = 0;
			finish();
		}
	};
	tocRailMotionRaf = requestAnimationFrame(step);
}

function collectTocActiveLiNodes(tocList: HTMLElement): HTMLElement[] {
	const out: HTMLElement[] = [];
	for (const a of tocList.querySelectorAll('a.is-active')) {
		const li = a.closest('li');
		if (li instanceof HTMLElement && !out.includes(li)) {
			out.push(li);
		}
	}
	return out;
}

function computeTocRailTargetScrollTopForCenteredHeads(
	tocRail: HTMLElement,
	tocList: HTMLElement,
	activeHeadEls: HTMLElement[],
): number | null {
	if (activeHeadEls.length === 0) return null;
	if (!window.matchMedia('(min-width: 1000px)').matches) return null;
	if (tocRail.getBoundingClientRect().height < 1) return null;

	const midIdx = Math.floor((activeHeadEls.length - 1) / 2);
	const midId = activeHeadEls[midIdx].id;
	let target: HTMLElement | null = null;
	for (const a of tocList.querySelectorAll('a[href^="#"]')) {
		const raw = (a.getAttribute('href') ?? '').replace(/^#/, '');
		if (raw === midId) {
			target = a as HTMLElement;
			break;
		}
	}
	if (!target) return null;

	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	if (maxScroll <= 0) return null;

	const tr = target.getBoundingClientRect();
	const windowMid = window.innerHeight / 2;
	const linkMidViewport = tr.top + tr.height / 2;
	let nextTop = tocRail.scrollTop + (linkMidViewport - windowMid);
	nextTop = Math.min(Math.max(0, nextTop), maxScroll);
	return nextTop;
}

function applyTocListIndicatorPx(tocList: HTMLElement, ind: TocListIndicatorPx): void {
	tocList.style.setProperty('--top', `${Math.round(ind.top)}px`);
	tocList.style.setProperty('--height', `${Math.round(Math.max(0, ind.height))}px`);
}

function measureTocListIndicatorFromLiNodes(
	tocList: HTMLElement,
	liNodes: HTMLElement[],
): TocListIndicatorPx {
	if (liNodes.length === 0) return { top: 0, height: 0 };
	const listR = tocList.getBoundingClientRect();
	let minTop = Infinity;
	let maxBottom = -Infinity;
	for (const li of liNodes) {
		const liR = li.getBoundingClientRect();
		const t = liR.top - listR.top;
		const b = liR.bottom - listR.top;
		minTop = Math.min(minTop, t);
		maxBottom = Math.max(maxBottom, b);
	}
	return {
		top: minTop,
		height: Math.max(0, maxBottom - minTop),
	};
}

/**
 * 指示条画在 `tocList`（`position: relative`）上；用相对列表的视口坐标，避免 `li.offsetTop` 在侧栏 `fixed` 等情况下 offsetParent 非 `ul` 导致 `--top` / `--height` 大幅错位。
 */
function setTocListIndicatorFromLiNodes(tocList: HTMLElement, liNodes: HTMLElement[]): void {
	applyTocListIndicatorPx(tocList, measureTocListIndicatorFromLiNodes(tocList, liNodes));
}

/** 阅读线：相对顶栏底边下移量占阅读区高度比例（取 clamp），线越靠上越晚切换到下一节 */
const TOC_READING_LINE_MIN_RATIO = 0.14;
const TOC_READING_LINE_MAX_RATIO = 0.28;
const TOC_READING_LINE_MIN_PX = 48;

/**
 * 当前阅读节：取「标题顶边 ≤ 阅读线」的最后一个标题（单节高亮），避免区间与视口求交时相邻节同时命中或边界过早切换。
 */
export function tocSync(tocList?: HTMLElement | null, docMainEl?: HTMLElement | null): void {
	if (!tocList || !docMainEl || !docMainEl.classList.contains('read-main')) return;
	const tocLinks = tocList.querySelectorAll('a[href^="#"]');
	const idWanted: Record<string, boolean> = {};
	for (const link of tocLinks) {
		const href = link.getAttribute('href') ?? '';
		const tid = href.startsWith('#') ? href.slice(1) : '';
		if (tid) idWanted[tid] = true;
	}
	const ordered: HTMLElement[] = [];
	for (const he of docMainEl.querySelectorAll('h2[id], h3[id], h4[id]')) {
		if (he instanceof HTMLElement && idWanted[he.id]) {
			ordered.push(he);
		}
	}
	const docCenter = docMainEl.closest('.sheet');
	const contentHead = docCenter?.querySelector(':scope > .bar') ?? null;
	const vpTop =
		contentHead instanceof HTMLElement ? contentHead.getBoundingClientRect().bottom : 0;
	const vpBottom = window.innerHeight;
	const bandH = Math.max(1, vpBottom - vpTop);
	const lineOffset = Math.min(
		Math.max(bandH * TOC_READING_LINE_MIN_RATIO, TOC_READING_LINE_MIN_PX),
		bandH * TOC_READING_LINE_MAX_RATIO,
	);
	const readingLineY = vpTop + lineOffset;

	let activeIndex = -1;
	for (let i = 0; i < ordered.length; i++) {
		if (ordered[i].getBoundingClientRect().top <= readingLineY) {
			activeIndex = i;
		}
	}

	let activeHeadEls: HTMLElement[];
	if (activeIndex >= 0) activeHeadEls = [ordered[activeIndex]];
	else if (ordered.length > 0) activeHeadEls = [ordered[0]];
	else activeHeadEls = [];

	const prevLis = collectTocActiveLiNodes(tocList);
	const prevInd = measureTocListIndicatorFromLiNodes(tocList, prevLis);

	for (const cand of tocLinks) {
		cand.classList.remove('is-active');
		cand.removeAttribute('aria-current');
	}
	const liNodesForIndicator: HTMLElement[] = [];
	let firstAria = true;
	for (const headEl of activeHeadEls) {
		const hid = headEl.id;
		for (const cand of tocLinks) {
			if ((cand.getAttribute('href') ?? '').replace(/^#/, '') !== hid) continue;
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
	const toInd = measureTocListIndicatorFromLiNodes(tocList, liNodesForIndicator);

	const sig = activeHeadEls.length > 0 ? activeHeadEls.map((h) => h.id).join('\u0001') : '';
	const vph = window.innerHeight;
	const viewportChanged = tocSyncLastViewportH > 0 && vph > 0 && vph !== tocSyncLastViewportH;
	tocSyncLastViewportH = vph;

	/* 首帧第一次 tocSync：轨道与指示条直接到位，避免从顶滑入 */
	const coldStartTocRailLayout = tocActiveHeadSig === '';
	const sigChanged = sig !== tocActiveHeadSig;
	if (sigChanged) tocActiveHeadSig = sig;

	const tocRailEl = tocList.closest('.toc');
	const wide = window.matchMedia('(min-width: 1000px)').matches;
	const tocRail = tocRailEl instanceof HTMLElement ? tocRailEl : null;

	let shouldSeekRail = false;
	let toScroll = tocRail?.scrollTop ?? 0;
	if (tocRail && wide) {
		if (activeHeadEls.length > 0 && (sigChanged || viewportChanged)) {
			shouldSeekRail = true;
			const c = computeTocRailTargetScrollTopForCenteredHeads(tocRail, tocList, activeHeadEls);
			toScroll = c ?? tocRail.scrollTop;
		} else if (sigChanged && activeHeadEls.length === 0) {
			shouldSeekRail = true;
			toScroll = 0;
		}
	}

	const fromScroll = tocRail?.scrollTop ?? 0;
	const geomDelta =
		Math.abs(toInd.top - prevInd.top) > 0.5 || Math.abs(toInd.height - prevInd.height) > 0.5;
	const scrollDelta = tocRail != null && Math.abs(toScroll - fromScroll) > 0.5;

	const runSyncAnim =
		tocRail != null &&
		wide &&
		shouldSeekRail &&
		(sigChanged || viewportChanged) &&
		(geomDelta || scrollDelta) &&
		!tocRailScrollShouldBeInstant() &&
		!coldStartTocRailLayout;

	if (runSyncAnim) {
		startTocRailScrollAndIndicatorSync(
			tocRail,
			tocList,
			fromScroll,
			toScroll,
			prevInd,
			toInd,
			liNodesForIndicator,
		);
	} else {
		if (!tocRailMotionBusy) {
			setTocListIndicatorFromLiNodes(tocList, liNodesForIndicator);
		}
		if (tocRail && wide && shouldSeekRail) {
			tocRail.scrollTop = toScroll;
		}
	}
}
