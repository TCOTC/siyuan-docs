import { onMediaQueryChange } from '../media-query';
import { scrollActiveRailNavIntoView, syncRailScrollEdges } from '../doc-reading-sync';

function setDocRailOpen(open: boolean): void {
	const toggle = document.getElementById('rail-menu-toggle');
	const backdrop = document.getElementById('rail-backdrop');
	const aside = document.getElementById('doc-rail');
	document.body.classList.toggle('doc-rail-open', open);
	document.body.style.overflow = open ? 'hidden' : '';
	if (!(toggle instanceof HTMLElement) || !(backdrop instanceof HTMLElement) || !(aside instanceof HTMLElement)) {
		return;
	}
	toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
	const whenOpen = toggle.getAttribute('data-aria-when-open') ?? '';
	const whenClosed = toggle.getAttribute('data-aria-when-closed') ?? '';
	toggle.setAttribute('aria-label', open ? whenOpen : whenClosed);
	backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
	if (open) {
		aside.setAttribute('aria-modal', 'true');
	} else {
		aside.removeAttribute('aria-modal');
	}
	if (open) {
		window.requestAnimationFrame(() => {
			scrollActiveRailNavIntoView();
			syncRailScrollEdges();
		});
	}
}

export function closeDocRailIfOpen(): void {
	if (document.body.classList.contains('doc-rail-open')) {
		setDocRailOpen(false);
	}
}

/** 窄屏侧栏抽屉：开关、Escape、断点升档时关闭、resize 时保持侧栏滚动边缘数据属性 */
export function mountDocRailDrawer(signal: AbortSignal): void {
	const railToggle = document.getElementById('rail-menu-toggle');
	const railBackdrop = document.getElementById('rail-backdrop');
	const railAside = document.getElementById('doc-rail');
	if (!railToggle || !railBackdrop || !railAside) return;
	const toggle = railToggle;
	const backdrop = railBackdrop;
	const aside = railAside;

	function closeDocRail(): void {
		setDocRailOpen(false);
	}

	toggle.addEventListener(
		'click',
		() => {
			setDocRailOpen(!document.body.classList.contains('doc-rail-open'));
		},
		{ signal },
	);
	backdrop.addEventListener('click', closeDocRail, { signal });
	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && document.body.classList.contains('doc-rail-open')) {
				closeDocRail();
			}
		},
		{ signal },
	);
	aside.addEventListener(
		'click',
		(e) => {
			const t = e.target;
			if (t instanceof Element && t.closest('a[href]')) {
				closeDocRail();
			}
		},
		{ signal },
	);
	/* 自 850px 起为固定侧栏档，离开 <850px 抽屉档时关闭抽屉 */
	const mqDocMid = window.matchMedia('(width >= 850px)');
	onMediaQueryChange(
		mqDocMid,
		(e) => {
			if (e.matches) closeDocRail();
		},
		signal,
	);
	window.addEventListener(
		'resize',
		() => {
			if (document.body.classList.contains('doc-rail-open')) {
				syncRailScrollEdges();
			}
		},
		{ passive: true, signal },
	);
}
