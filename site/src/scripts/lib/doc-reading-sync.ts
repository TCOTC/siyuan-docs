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
