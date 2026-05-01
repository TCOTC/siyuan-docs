import { onMediaQueryChange } from '../media-query';
import {
	scrollActiveRailNavIntoView,
	syncDocOverlayLayoutMetrics,
	syncRailScrollEdges,
} from '../doc-reading-sync';

/** 窄屏侧栏抽屉：开关、Escape、断点升档时关闭、resize 时同步 overlay */
export function mountDocRailDrawer(): void {
	const railToggle = document.getElementById('rail-menu-toggle');
	const railBackdrop = document.getElementById('rail-backdrop');
	const railAside = document.getElementById('doc-rail');
	if (!railToggle || !railBackdrop || !railAside) return;
	const toggle = railToggle;
	const backdrop = railBackdrop;
	const aside = railAside;

	function setDocRailOpen(open: boolean): void {
		document.body.classList.toggle('doc-rail-open', open);
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
		document.body.style.overflow = open ? 'hidden' : '';
		if (open) {
			syncDocOverlayLayoutMetrics();
			window.requestAnimationFrame(() => {
				scrollActiveRailNavIntoView();
				syncRailScrollEdges();
			});
		}
	}

	function closeDocRail(): void {
		setDocRailOpen(false);
	}

	toggle.addEventListener('click', () => {
		setDocRailOpen(!document.body.classList.contains('doc-rail-open'));
	});
	backdrop.addEventListener('click', closeDocRail);
	document.addEventListener('keydown', (e: KeyboardEvent) => {
		if (e.key === 'Escape' && document.body.classList.contains('doc-rail-open')) {
			closeDocRail();
		}
	});
	aside.addEventListener('click', (e) => {
		const t = e.target;
		if (t instanceof Element && t.closest('a[href]')) {
			closeDocRail();
		}
	});
	/* 自 850px 起为固定侧栏档，离开 <850px 抽屉档时关闭抽屉 */
	const mqDocMid = window.matchMedia('(width >= 850px)');
	onMediaQueryChange(mqDocMid, (e) => {
		if (e.matches) closeDocRail();
	});
	window.addEventListener(
		'resize',
		() => {
			if (document.body.classList.contains('doc-rail-open')) {
				syncDocOverlayLayoutMetrics();
			}
		},
		{ passive: true },
	);
}
