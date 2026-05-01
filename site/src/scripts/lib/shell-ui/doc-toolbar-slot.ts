import { onMediaQueryChange } from '../media-query';

/** 文档工具条在顶栏槽与侧栏槽之间随断点移动 */
export function mountDocToolbarSlot(): void {
	const floater = document.getElementById('doc-toolbar-floater');
	const slotHead = document.getElementById('doc-toolbar-slot-content-head');
	const slotRail = document.getElementById('doc-toolbar-slot-rail');
	if (
		!floater ||
		!slotHead ||
		!slotRail ||
		!document.body.classList.contains('doc-layout')
	) {
		return;
	}
	const toolbarFloater = floater;
	const toolbarSlotHead = slotHead;
	const toolbarSlotRail = slotRail;
	const mqDocToolbar = window.matchMedia('(min-width: 450px)');
	function placeDocToolbar(): void {
		if (mqDocToolbar.matches) {
			toolbarSlotHead.appendChild(toolbarFloater);
		} else {
			toolbarSlotRail.appendChild(toolbarFloater);
		}
	}
	placeDocToolbar();
	onMediaQueryChange(mqDocToolbar, placeDocToolbar);
}
