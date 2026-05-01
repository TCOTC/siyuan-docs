/** 404 页按检测结果切换为中文 UI 时，由脚本写入 DOM 的文案集合 */

export interface NotFoundLocalePatch {
	title: string;
	description: string;
	pagefindLang: string;
	docNavAria: string;
	skipToContent: string;
	railBrandHref: string;
	railSiteLabel: string;
	searchHint: string;
	searchOpenAria: string;
	themeToggleAria: string;
	themeToggleHint: string;
	copyPageMdAria: string;
	copyPageHint: string;
	copyMenuMoreTitle: string;
	copyMenuMdTitle: string;
	copyMenuMdDesc: string;
	copyMenuViewTitle: string;
	copyMenuViewDesc: string;
	langSwitcherAria: string;
	langSwitcherHint: string;
	railMenuOpenAria: string;
	railMenuCloseAria: string;
}
