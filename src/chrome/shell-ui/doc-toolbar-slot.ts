import { onMediaQueryChange } from '../media-query';

/** 文档工具条在顶栏槽与侧栏槽之间随断点移动（未满 750px 时挂抽屉顶栏） */
export function mountDocToolbarSlot(): void {
	const floater = document.getElementById('tool-float');
	const slotHead = document.getElementById('tool-slot-bar');
	const slotRail = document.getElementById('tool-slot-rail');
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
	const mqDocToolbar = window.matchMedia('(min-width: 750px)');
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
