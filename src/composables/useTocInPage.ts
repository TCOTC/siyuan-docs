import { onMounted, onUnmounted, type Ref } from 'vue';

/** 阅读线：相对顶栏底边下移量占阅读区高度比例（取 clamp），线越靠上越晚切换到下一节 */
const TOC_READING_LINE_MIN_RATIO = 0.14;
const TOC_READING_LINE_MAX_RATIO = 0.28;
const TOC_READING_LINE_MIN_PX = 48;

function setTocListIndicator(tocList: HTMLElement, liNodes: HTMLElement[]): void {
	if (liNodes.length === 0) {
		tocList.style.setProperty('--top', '0px');
		tocList.style.setProperty('--height', '0px');
		return;
	}
	const listR = tocList.getBoundingClientRect();
	let minTop = Infinity;
	let maxBottom = -Infinity;
	for (const li of liNodes) {
		const liR = li.getBoundingClientRect();
		minTop = Math.min(minTop, liR.top - listR.top);
		maxBottom = Math.max(maxBottom, liR.bottom - listR.top);
	}
	tocList.style.setProperty('--top', `${Math.round(minTop)}px`);
	tocList.style.setProperty('--height', `${Math.round(Math.max(0, maxBottom - minTop))}px`);
}

/** 宽屏下把当前大纲项滚到视口中线附近；直接改 scrollTop，避免自定义缓动与指示条抢同一 rAF */
function scrollTocLinkIntoView(tocList: HTMLElement, headId: string | null): void {
	if (!window.matchMedia('(min-width: 1000px)').matches) return;
	const tocRail = tocList.closest('.toc');
	if (!(tocRail instanceof HTMLElement) || tocRail.getBoundingClientRect().height < 1) return;
	if (!headId) {
		tocRail.scrollTop = 0;
		return;
	}
	let target: HTMLElement | null = null;
	for (const a of tocList.querySelectorAll('a[href^="#"]')) {
		if ((a.getAttribute('href') ?? '').replace(/^#/, '') === headId) {
			target = a as HTMLElement;
			break;
		}
	}
	if (!target) return;
	const maxScroll = Math.max(0, tocRail.scrollHeight - tocRail.clientHeight);
	if (maxScroll <= 0) return;
	const tr = target.getBoundingClientRect();
	const nextTop = tocRail.scrollTop + (tr.top + tr.height / 2 - window.innerHeight / 2);
	tocRail.scrollTop = Math.min(Math.max(0, nextTop), maxScroll);
}

/** 本页目录与正文滚动同步：阅读线高亮、指示条、大纲滚入当前项 */
export function useTocInPage(
	tocList: Ref<HTMLElement | null>,
	main: Ref<HTMLElement | null>,
): {
	tocSync: () => void;
	resetTocSyncState: () => void;
} {
	/** 避免正文滚动时每个 rAF 都重算大纲 scrollTop；仅在高亮或视口高度变化时自动滚大纲 */
	let tocActiveHeadSig = '';
	let tocSyncLastViewportH = 0;

	function resetTocSyncState(): void {
		tocActiveHeadSig = '';
		tocSyncLastViewportH = 0;
	}

	function tocSync(): void {
		const list = tocList.value;
		const docMainEl = main.value;
		if (!list || !docMainEl || !docMainEl.classList.contains('read-main')) return;

		const tocLinks = list.querySelectorAll('a[href^="#"]');
		const idWanted: Record<string, boolean> = {};
		for (const link of tocLinks) {
			const href = link.getAttribute('href') ?? '';
			const tid = href.startsWith('#') ? href.slice(1) : '';
			if (tid) idWanted[tid] = true;
		}
		const ordered: HTMLElement[] = [];
		for (const he of docMainEl.querySelectorAll('h2[id], h3[id], h4[id]')) {
			if (he instanceof HTMLElement && idWanted[he.id]) ordered.push(he);
		}

		const contentHead = docMainEl.closest('.sheet')?.querySelector(':scope > .bar') ?? null;
		const vpTop =
			contentHead instanceof HTMLElement ? contentHead.getBoundingClientRect().bottom : 0;
		const bandH = Math.max(1, window.innerHeight - vpTop);
		const lineOffset = Math.min(
			Math.max(bandH * TOC_READING_LINE_MIN_RATIO, TOC_READING_LINE_MIN_PX),
			bandH * TOC_READING_LINE_MAX_RATIO,
		);
		const readingLineY = vpTop + lineOffset;

		let activeIndex = -1;
		for (let i = 0; i < ordered.length; i++) {
			if (ordered[i].getBoundingClientRect().top <= readingLineY) activeIndex = i;
		}
		const activeHead =
			activeIndex >= 0 ? ordered[activeIndex] : ordered.length > 0 ? ordered[0] : null;

		for (const cand of tocLinks) {
			cand.classList.remove('is-active');
			cand.removeAttribute('aria-current');
		}
		const liNodes: HTMLElement[] = [];
		if (activeHead) {
			for (const cand of tocLinks) {
				if ((cand.getAttribute('href') ?? '').replace(/^#/, '') !== activeHead.id) continue;
				cand.classList.add('is-active');
				cand.setAttribute('aria-current', 'location');
				const liNode = cand.closest('li');
				if (liNode instanceof HTMLElement) liNodes.push(liNode);
				break;
			}
		}
		setTocListIndicator(list, liNodes);

		const sig = activeHead?.id ?? '';
		const vph = window.innerHeight;
		const viewportChanged = tocSyncLastViewportH > 0 && vph > 0 && vph !== tocSyncLastViewportH;
		tocSyncLastViewportH = vph;
		const sigChanged = sig !== tocActiveHeadSig;
		if (sigChanged) tocActiveHeadSig = sig;
		if (sigChanged || viewportChanged) {
			scrollTocLinkIntoView(list, activeHead?.id ?? null);
		}
	}

	/** hash 变化等：跟上平滑滚动，再补一帧与一次短延迟 */
	function scheduleTocSyncSoon(): void {
		tocSync();
		requestAnimationFrame(() => {
			tocSync();
		});
		window.setTimeout(() => {
			tocSync();
		}, 64);
	}

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
	return { tocSync, resetTocSyncState };
}
