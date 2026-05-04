import type { CodeBlockCopyUi, ShellUi } from './types';

/** 站点语言 `en` 文案 */
export const enShellUi: ShellUi = {
	siteName: 'SiYuan Developers',
	railSiteLabel: 'Developers',
	skipToContent: 'Skip to content →',
	themeToggleAria: 'Toggle light or dark theme',
	themeToggleHint: 'Toggle theme',
	topNavAria: 'Top',
	topNavDocs: 'Docs',
	docNavAria: 'Documentation navigation',
	railNavAria: 'Sidebar',
	railFooterDocs: 'Developers',
	railFooterBazaar: 'Community marketplace',
	railFooterOfficial: 'Official site',
	breadcrumbsAria: 'Breadcrumbs',
	copyPageMdAria: 'Copy page as Markdown',
	copyPageHint: 'Copy page as Markdown',
	copyMenuMoreTitle: 'More options',
	copyMenuMdTitle: 'Copy page',
	copyMenuMdDesc: 'Copy page as Markdown',
	copyMenuViewTitle: 'View Markdown',
	copyMenuViewDesc: 'View plain text for this page',
	railMenuOpenAria: 'Open documentation navigation',
	railMenuCloseAria: 'Close documentation navigation',
	tocAsideAria: 'On this page',
	langSwitcherAria: 'Interface language',
	langSwitcherHint: 'Switch language',
	navIntro: 'Introduction',
	navPlugin: 'Plugins',
	navTheme: 'Themes',
	navGroup: { intro: 'Introduction', plugin: 'Plugins', theme: 'Themes' },
	searchHint: 'Search',
	searchOpenAria: 'Open search',
	shellTitle: 'Page not found',
	shellDescription:
		'This page does not exist. Use the sidebar or the search field in the header.',
	heading: 'Page not found',
	body: 'The URL may have moved, contain a typo, or not exist in this deployment.',
	button: 'Open documentation home',
	crumbLabel: 'Page not found',
};

export const enCodeBlockCopyUi: CodeBlockCopyUi = {
	copyAria: 'Copy code',
	copiedAria: 'Copied',
	failedAria: 'Copy failed',
};
