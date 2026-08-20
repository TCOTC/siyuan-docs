/**
 * 侧栏目录滚动：边缘阴影、程序化滚入当前项、滚动条短暂显示抑制。
 */

/** 脚本自动滚动侧栏目录时的嵌套深度；> 0 时不短暂显示滚动条 */
let programmaticRailScrollDepth = 0;

function bumpProgrammaticRailScrollDepth(): void {
	programmaticRailScrollDepth += 1;
}

function scheduleReleaseProgrammaticRailScrollDepth(): void {
	queueMicrotask(() => {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				programmaticRailScrollDepth = Math.max(0, programmaticRailScrollDepth - 1);
			});
		});
	});
}

function isProgrammaticRailScroll(): boolean {
	return programmaticRailScrollDepth > 0;
}

export function syncRailScrollEdges(
	railScrollEl?: Element | null,
	railScrollClip?: Element | null,
): void {
	const el = railScrollEl ?? document.querySelector('.rail-scroll');
	const clip = railScrollClip ?? document.querySelector('[data-rail-scroll-clip]');
	if (!el || !clip) return;
	const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
	const canScroll = maxScroll > 2;
	const st = el.scrollTop;
	const atTop = st <= 1;
	const atBottom = st >= maxScroll - 1;
	clip.setAttribute('data-edge-top', canScroll && !atTop ? '1' : '0');
	clip.setAttribute('data-edge-bottom', canScroll && !atBottom ? '1' : '0');
}

/** 程序化滚动期间不点亮侧栏滚动条 */
export function shouldSuppressRailScrollbarTransient(): boolean {
	return isProgrammaticRailScroll();
}

/**
 * 仅操作 `.rail-scroll` 的 scrollTop，避免 `scrollIntoView` 连带滚动页面主栏或其它祖先。
 * 目录末尾项会钳制到 maxScroll，保证当前链接落在可视区内。
 */
function applyRailActiveNavScroll(rail: HTMLElement, target: HTMLElement): void {
	const maxScroll = Math.max(0, rail.scrollHeight - rail.clientHeight);
	if (maxScroll <= 0 || rail.clientHeight <= 0) return;
	bumpProgrammaticRailScrollDepth();
	try {
		const rr = rail.getBoundingClientRect();
		const tr = target.getBoundingClientRect();
		const yCenterInContent = rail.scrollTop + (tr.top - rr.top) + tr.height / 2;
		let nextTop = yCenterInContent - rail.clientHeight / 2;
		nextTop = Math.min(Math.max(0, nextTop), maxScroll);
		rail.scrollTop = nextTop;
	} finally {
		scheduleReleaseProgrammaticRailScrollDepth();
	}
}

/**
 * 将侧栏文档目录中当前页链接滚入 `.rail-scroll` 可视区域（尽量居中；双语文档栈仅处理可见的一项）。
 * 进入文档时的初定位由布局挂载尽早执行；此处供窄屏打开抽屉等后续场景。
 */
export function scrollActiveRailNavIntoView(railScrollEl?: HTMLElement | null): void {
	const railScroll = railScrollEl ?? document.querySelector('.rail-scroll');
	if (!(railScroll instanceof HTMLElement)) return;
	let target: HTMLElement | null = null;
	for (const el of railScroll.querySelectorAll('.rail-nav__link.is-active')) {
		if (!(el instanceof HTMLElement)) continue;
		const r = el.getBoundingClientRect();
		if (r.width > 0 && r.height > 0) {
			target = el;
			break;
		}
	}
	if (!target) return;
	const activeLink = target;
	const run = (): void => {
		applyRailActiveNavScroll(railScroll, activeLink);
	};
	run();
	requestAnimationFrame(run);
}
