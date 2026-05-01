/* 阻塞脚本：在 ES module（shell-ui 等）执行前同步侧栏边缘与本页目录状态，避免首屏闪动。
 * 逻辑须与 src/scripts/shell-ui.js 内 syncRailScrollEdges / tocSync 保持一致。 */
(function () {
	function syncRailScrollEdges() {
		var railScrollEl = document.querySelector('.rail-scroll');
		var railScrollClip = document.querySelector('[data-rail-scroll-clip]');
		if (!railScrollEl || !railScrollClip) return;
		var el = railScrollEl;
		var maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
		var canScroll = maxScroll > 2;
		var st = el.scrollTop;
		var atTop = st <= 1;
		var atBottom = st >= maxScroll - 1;
		railScrollClip.setAttribute('data-edge-top', canScroll && !atTop ? '1' : '0');
		railScrollClip.setAttribute('data-edge-bottom', canScroll && !atBottom ? '1' : '0');
	}

	function tocSync() {
		var tocList = document.getElementById('doc-toc-list');
		var docMainEl = document.getElementById('main-content');
		if (!tocList || !docMainEl || !docMainEl.classList.contains('doc-main')) return;
		var tocLinks = tocList.querySelectorAll('a[href^="#"]');
		var idWanted = {};
		for (var ti = 0; ti < tocLinks.length; ti++) {
			var href = tocLinks[ti].getAttribute('href') || '';
			var tid = href.charAt(0) === '#' ? href.slice(1) : '';
			if (tid) idWanted[tid] = true;
		}
		var allHeads = docMainEl.querySelectorAll('h2[id], h3[id], h4[id]');
		var ordered = [];
		for (var hi = 0; hi < allHeads.length; hi++) {
			var he = allHeads[hi];
			if (idWanted[he.id]) ordered.push(he);
		}
		var scrollRootEl = docMainEl.closest('.doc-reading');
		var vpTop;
		var vpBottom;
		if (scrollRootEl) {
			var rr = scrollRootEl.getBoundingClientRect();
			vpTop = rr.top;
			vpBottom = rr.bottom;
		} else {
			vpTop = 0;
			vpBottom = window.innerHeight || document.documentElement.clientHeight || 0;
		}
		var mainBottom = docMainEl.getBoundingClientRect().bottom;
		var activeHeadEls = [];
		for (var oi = 0; oi < ordered.length; oi++) {
			var headEl = ordered[oi];
			var sectionTop = headEl.getBoundingClientRect().top;
			var nextHead = ordered[oi + 1];
			var sectionBottom = nextHead ? nextHead.getBoundingClientRect().top : mainBottom;
			if (sectionBottom > vpTop && sectionTop < vpBottom) activeHeadEls.push(headEl);
		}
		for (var li = 0; li < tocLinks.length; li++) {
			tocLinks[li].classList.remove('is-active');
			tocLinks[li].removeAttribute('aria-current');
		}
		var minLiTop = null;
		var maxLiBottom = null;
		var firstAria = true;
		for (var ai = 0; ai < activeHeadEls.length; ai++) {
			var hid = activeHeadEls[ai].id;
			for (var lj = 0; lj < tocLinks.length; lj++) {
				var cand = tocLinks[lj];
				if ((cand.getAttribute('href') || '').replace(/^#/, '') !== hid) continue;
				cand.classList.add('is-active');
				if (firstAria) {
					cand.setAttribute('aria-current', 'location');
					firstAria = false;
				}
				var liNode = cand.closest('li');
				if (liNode) {
					var t = liNode.offsetTop;
					var b = t + liNode.offsetHeight;
					if (minLiTop === null || t < minLiTop) minLiTop = t;
					if (maxLiBottom === null || b > maxLiBottom) maxLiBottom = b;
				}
				break;
			}
		}
		if (minLiTop !== null && maxLiBottom !== null) {
			tocList.style.setProperty('--top', minLiTop + 'px');
			tocList.style.setProperty('--height', maxLiBottom - minLiTop + 'px');
		} else {
			tocList.style.setProperty('--top', '0px');
			tocList.style.setProperty('--height', '0px');
		}
	}

	syncRailScrollEdges();
	var tocListBoot = document.getElementById('doc-toc-list');
	var docMainBoot = document.getElementById('main-content');
	if (
		tocListBoot &&
		docMainBoot &&
		docMainBoot.classList.contains('doc-main')
	) {
		tocSync();
		window.__siyuanDocsTocBootstrapped = true;
	}
	document.documentElement.classList.add('doc-shell-ready');
	/* 首帧指示条已写入 --top/--height 后再允许过渡，避免竖线从 0 位「滑入」 */
	if (typeof window.requestAnimationFrame === 'function') {
		window.requestAnimationFrame(function () {
			window.requestAnimationFrame(function () {
				document.documentElement.classList.add('toc-indicator-motion');
			});
		});
	} else {
		document.documentElement.classList.add('toc-indicator-motion');
	}
})();
