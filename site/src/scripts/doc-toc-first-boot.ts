/**
 * 本页大纲首屏：须 `is:inline` 且紧跟 `#doc-toc-list` 之后同步执行，避免外链 `src` 在 fetch
 * 期间先画出 scrollTop=0 再瞬移。算法与 `doc-reading-sync.ts` 中 `tocSync` / hash 分支保持一致。
 * 由 `Shell.astro` 以 `?inline-bundle` 压缩后内联；外层 IIFE 保留 `return` 语义，esbuild 会再包一层 iife 产出。
 */
(function () {
	const root = document.documentElement;
	const dc = document.querySelector('.doc-center');
	const toc = document.querySelector('.toc-rail') as HTMLElement | null;
	try {
		if (
			dc &&
			toc &&
			window.matchMedia &&
			window.matchMedia('(min-width: 1000px)').matches &&
			toc.offsetWidth > 0
		) {
			const dcr = dc.getBoundingClientRect();
			root.style.setProperty('--doc-toc-fixed-left', Math.round(dcr.right - toc.offsetWidth) + 'px');
		} else {
			root.style.removeProperty('--doc-toc-fixed-left');
		}
	} catch {
		/* ignore */
	}

	const h = window.location.hash;
	if (h && h.length >= 2) {
		const enc = h.slice(1);
		let id: string;
		try {
			id = decodeURIComponent(enc);
		} catch {
			id = enc;
		}
		if (!window.matchMedia || !window.matchMedia('(min-width: 1000px)').matches) {
			return;
		}
		const tocList = document.getElementById('doc-toc-list');
		if (!toc || !tocList) return;
		if (toc.getBoundingClientRect().height < 1) return;
		const links = tocList.querySelectorAll('a[href^="#"]');
		let target: Element | null = null;
		for (let i = 0; i < links.length; i++) {
			const raw = (links[i].getAttribute('href') || '').replace(/^#/, '');
			if (raw === id) {
				target = links[i];
				break;
			}
		}
		if (!target) return;
		for (let j = 0; j < links.length; j++) {
			links[j].classList.remove('is-active');
			links[j].removeAttribute('aria-current');
		}
		target.classList.add('is-active');
		target.setAttribute('aria-current', 'location');
		const liNode = target.closest('li');
		if (liNode) {
			const listR = tocList.getBoundingClientRect();
			const liR = liNode.getBoundingClientRect();
			const topPx = Math.round(liR.top - listR.top);
			const botPx = Math.round(liR.bottom - listR.top);
			const hPx = Math.max(0, botPx - topPx);
			tocList.style.setProperty('--top', topPx + 'px');
			tocList.style.setProperty('--height', hPx + 'px');
		}
		const maxScroll = Math.max(0, toc.scrollHeight - toc.clientHeight);
		const tr = target.getBoundingClientRect();
		const windowMid = (window.innerHeight || document.documentElement.clientHeight || 0) / 2;
		const linkMidViewport = tr.top + tr.height / 2;
		let nextTop = toc.scrollTop + (linkMidViewport - windowMid);
		if (nextTop < 0) nextTop = 0;
		else if (nextTop > maxScroll) nextTop = maxScroll;
		toc.scrollTop = nextTop;
	} else {
		if (!window.matchMedia || !window.matchMedia('(min-width: 1000px)').matches) {
			return;
		}
		const tocList0 = document.getElementById('doc-toc-list');
		const docMain0 = document.getElementById('main-content');
		if (!toc || !tocList0 || !docMain0 || !docMain0.classList.contains('doc-main')) return;
		if (toc.getBoundingClientRect().height < 1) return;

		const measureInd = function (list: Element, liNodes: Element[]) {
			if (!liNodes.length) return { top: 0, height: 0 };
			const listR = list.getBoundingClientRect();
			let minTop = Infinity;
			let maxBottom = -Infinity;
			for (let mi = 0; mi < liNodes.length; mi++) {
				const liR = liNodes[mi].getBoundingClientRect();
				const t = liR.top - listR.top;
				const b = liR.bottom - listR.top;
				if (t < minTop) minTop = t;
				if (b > maxBottom) maxBottom = b;
			}
			return { top: minTop, height: Math.max(0, maxBottom - minTop) };
		};

		const RL_MIN_R = 0.14;
		const RL_MAX_R = 0.28;
		const RL_MIN_PX = 48;

		const links0 = tocList0.querySelectorAll('a[href^="#"]');
		const idWanted: Record<string, boolean> = {};
		for (let ti = 0; ti < links0.length; ti++) {
			const href0 = links0[ti].getAttribute('href') || '';
			const tid0 = href0.charAt(0) === '#' ? href0.slice(1) : '';
			if (tid0) idWanted[tid0] = true;
		}
		const allHeads0 = docMain0.querySelectorAll('h2[id],h3[id],h4[id]');
		const ordered0: HTMLElement[] = [];
		for (let hi = 0; hi < allHeads0.length; hi++) {
			const he0 = allHeads0[hi] as HTMLElement;
			if (idWanted[he0.id]) ordered0.push(he0);
		}
		const docCenter0 = docMain0.closest('.doc-center');
		const ch0 = docCenter0 ? docCenter0.querySelector(':scope > .content-head') : null;
		let vpTop0 = 0;
		if (ch0) {
			try {
				vpTop0 = ch0.getBoundingClientRect().bottom;
			} catch {
				vpTop0 = 0;
			}
		}
		const vpBottom0 = window.innerHeight || document.documentElement.clientHeight || 0;
		const bandH0 = Math.max(1, vpBottom0 - vpTop0);
		const lineOff0 = Math.min(Math.max(bandH0 * RL_MIN_R, RL_MIN_PX), bandH0 * RL_MAX_R);
		const readingY0 = vpTop0 + lineOff0;

		let activeIx = -1;
		for (let ai = 0; ai < ordered0.length; ai++) {
			if (ordered0[ai].getBoundingClientRect().top <= readingY0) activeIx = ai;
		}
		let activeHeads: HTMLElement[] = [];
		if (activeIx >= 0) activeHeads = [ordered0[activeIx]];
		else if (ordered0.length > 0) activeHeads = [ordered0[0]];

		for (let lj = 0; lj < links0.length; lj++) {
			links0[lj].classList.remove('is-active');
			links0[lj].removeAttribute('aria-current');
		}
		const liNodesInd: Element[] = [];
		let firstAria0 = true;
		for (let aj = 0; aj < activeHeads.length; aj++) {
			const hid0 = activeHeads[aj].id;
			for (let lk = 0; lk < links0.length; lk++) {
				const cand0 = links0[lk];
				if ((cand0.getAttribute('href') || '').replace(/^#/, '') !== hid0) continue;
				cand0.classList.add('is-active');
				if (firstAria0) {
					cand0.setAttribute('aria-current', 'location');
					firstAria0 = false;
				}
				const liN0 = cand0.closest('li');
				if (liN0 && liNodesInd.indexOf(liN0) < 0) liNodesInd.push(liN0);
				break;
			}
		}
		const ind0 = measureInd(tocList0, liNodesInd);
		tocList0.style.setProperty('--top', Math.round(ind0.top) + 'px');
		tocList0.style.setProperty('--height', Math.round(Math.max(0, ind0.height)) + 'px');

		if (activeHeads.length > 0) {
			const midIx = Math.floor((activeHeads.length - 1) / 2);
			const midId0 = activeHeads[midIx].id;
			let targetLk: Element | null = null;
			for (let nk = 0; nk < links0.length; nk++) {
				const rawN = (links0[nk].getAttribute('href') || '').replace(/^#/, '');
				if (rawN === midId0) {
					targetLk = links0[nk];
					break;
				}
			}
			if (targetLk) {
				const maxS0 = Math.max(0, toc.scrollHeight - toc.clientHeight);
				if (maxS0 > 0) {
					const tr0 = targetLk.getBoundingClientRect();
					const wm0 = (window.innerHeight || document.documentElement.clientHeight || 0) / 2;
					const lm0 = tr0.top + tr0.height / 2;
					let nt0 = toc.scrollTop + (lm0 - wm0);
					if (nt0 < 0) nt0 = 0;
					else if (nt0 > maxS0) nt0 = maxS0;
					toc.scrollTop = nt0;
				}
			}
		} else {
			toc.scrollTop = 0;
		}
	}
})();
