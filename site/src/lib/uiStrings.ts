import type { AppLocale } from './appLocale';
import type { NavGroupKey } from './developerDocPath';

export type ShellUi = {
	siteName: string;
	railSiteLabel: string;
	skipToContent: string;
	themeToggleAria: string;
	themeToggleHint: string;
	themeKeyT: string;
	topNavAria: string;
	topNavDocs: string;
	docNavAria: string;
	railNavAria: string;
	railFooterDocs: string;
	railFooterBazaar: string;
	railFooterOfficial: string;
	breadcrumbsAria: string;
	copyPageMdAria: string;
	copyPageHint: string;
	copyMenuMoreTitle: string;
	copyMenuMdTitle: string;
	copyMenuMdDesc: string;
	copyMenuViewTitle: string;
	copyMenuViewDesc: string;
	railMenuOpenAria: string;
	railMenuCloseAria: string;
	tocAsideAria: string;
	langSwitcherZh: string;
	langSwitcherEn: string;
	langSwitcherAria: string;
	/** 语言按钮悬停提示（与界面语言一致） */
	langSwitcherHint: string;
	/** 代码块右上角复制按钮 */
	copyCodeBlockAria: string;
	copyCodeBlockCopiedAria: string;
	copyCodeBlockFailedAria: string;
};

const shellZh: ShellUi = {
	siteName: '思源开发者',
	railSiteLabel: '开发者',
	skipToContent: '跳到正文 →',
	themeToggleAria: '切换浅色或深色主题（快捷键 T）',
	themeToggleHint: '切换主题',
	themeKeyT: 'T',
	topNavAria: '顶部',
	topNavDocs: '文档',
	docNavAria: '文档导航',
	railNavAria: '侧栏目录',
	railFooterDocs: '开发者',
	railFooterBazaar: '社区集市',
	railFooterOfficial: '官网',
	breadcrumbsAria: '面包屑',
	copyPageMdAria: '复制页面内容为 Markdown',
	copyPageHint: '复制页面内容为 Markdown',
	copyMenuMoreTitle: '更多选项',
	copyMenuMdTitle: '复制页面',
	copyMenuMdDesc: '复制页面内容为 Markdown',
	copyMenuViewTitle: '查看 Markdown',
	copyMenuViewDesc: '查看该页面的纯文本',
	railMenuOpenAria: '打开文档导航',
	railMenuCloseAria: '关闭文档导航',
	tocAsideAria: '本页目录',
	langSwitcherZh: '中文',
	langSwitcherEn: 'English',
	langSwitcherAria: '界面语言',
	langSwitcherHint: '切换语言',
	copyCodeBlockAria: '复制代码',
	copyCodeBlockCopiedAria: '已复制',
	copyCodeBlockFailedAria: '复制失败',
};

const shellEn: ShellUi = {
	siteName: 'SiYuan Developers',
	railSiteLabel: 'Developers',
	skipToContent: 'Skip to content →',
	themeToggleAria: 'Toggle light or dark theme (shortcut T)',
	themeToggleHint: 'Toggle theme',
	themeKeyT: 'T',
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
	langSwitcherZh: '中文',
	langSwitcherEn: 'English',
	langSwitcherAria: 'Interface language',
	langSwitcherHint: 'Switch language',
	copyCodeBlockAria: 'Copy code',
	copyCodeBlockCopiedAria: 'Copied',
	copyCodeBlockFailedAria: 'Copy failed',
};

export function shellUi(locale: AppLocale): ShellUi {
	return locale === 'en' ? shellEn : shellZh;
}

export type NavUi = {
	navIntro: string;
	navPlugin: string;
	navTheme: string;
	navGroup: Record<NavGroupKey, string>;
};

const navZh: NavUi = {
	navIntro: '入门',
	navPlugin: '插件',
	navTheme: '主题',
	navGroup: { intro: '入门', plugin: '插件', theme: '主题' },
};

const navEn: NavUi = {
	navIntro: 'Introduction',
	navPlugin: 'Plugins',
	navTheme: 'Themes',
	navGroup: { intro: 'Introduction', plugin: 'Plugins', theme: 'Themes' },
};

export function navUi(locale: AppLocale): NavUi {
	return locale === 'en' ? navEn : navZh;
}

export type PagefindToolbarUi = {
	searchHint: string;
	/** 搜索圆形按钮的可访问名称（占位与 Pagefind 正式按钮共用） */
	searchOpenAria: string;
};

export function pagefindToolbarUi(locale: AppLocale): PagefindToolbarUi {
	return locale === 'en'
		? { searchHint: 'Search', searchOpenAria: 'Open search' }
		: { searchHint: '搜索', searchOpenAria: '打开搜索' };
}

export type NotFoundUi = {
	shellTitle: string;
	shellDescription: string;
	heading: string;
	body: string;
	button: string;
	/** 侧栏面包屑当前页标签 */
	crumbLabel: string;
};

const notFoundZh: NotFoundUi = {
	shellTitle: '页面未找到',
	shellDescription: '未找到该页面。可从侧栏进入其他章节或使用顶栏搜索。',
	heading: '页面未找到',
	body: '该地址可能已移动、拼写有误，或当前部署中尚不存在。',
	button: '打开文档首页',
	crumbLabel: '页面未找到',
};

const notFoundEn: NotFoundUi = {
	shellTitle: 'Page not found',
	shellDescription: 'This page does not exist. Use the sidebar or the search field in the header.',
	heading: 'Page not found',
	body: 'The URL may have moved, contain a typo, or not exist in this deployment.',
	button: 'Open documentation home',
	crumbLabel: 'Page not found',
};

export function notFoundUi(locale: AppLocale): NotFoundUi {
	return locale === 'en' ? notFoundEn : notFoundZh;
}
