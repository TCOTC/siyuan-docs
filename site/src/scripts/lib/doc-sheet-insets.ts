/**
 * 将 `.sheet` 的视口水平 inset 同步到 `body.doc-layout` 的 `--sheet-pl` / `--sheet-pr`。
 * 仅当与当前计算值相差 ≥ 1px 时才写入 `body.style`，避免与样式表中 `clamp` 首帧已很接近时再改变量触发亚像素重排与正文轻微上下抖。
 */
export function applyDocSheetViewportInsets(): void {
	const body = document.body;
	if (!body.classList.contains('doc-layout')) return;
	const sheet = document.querySelector('.sheet');
	if (!(sheet instanceof HTMLElement)) return;

	const r = sheet.getBoundingClientRect();
	const vw = document.documentElement.clientWidth;
	const pl = Math.round(r.left);
	const pr = Math.round(Math.max(0, vw - r.right));

	const cs = getComputedStyle(body);
	const prevPl = parseFloat(cs.getPropertyValue('--sheet-pl'));
	const prevPr = parseFloat(cs.getPropertyValue('--sheet-pr'));
	const plRef = Number.isFinite(prevPl) ? prevPl : pl;
	const prRef = Number.isFinite(prevPr) ? prevPr : pr;

	if (Math.abs(plRef - pl) >= 1) {
		body.style.setProperty('--sheet-pl', `${pl}px`);
	}
	if (Math.abs(prRef - pr) >= 1) {
		body.style.setProperty('--sheet-pr', `${pr}px`);
	}
}
