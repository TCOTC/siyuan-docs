import type { AppLocale } from '../lib/appLocale';
import type { NavGroupKey } from '../lib/developerDocPath';

/**
 * 与 Astro Shell / 文档页 / 404 同一 HTML 产物内共用的壳层文案（含导航、Pagefind、404 文案）。
 * 代码块复制按钮见独立产物 `code-block-copy`，对应类型为 `CodeBlockCopyUi`。
 */
export type ShellUi = {
	/** `<title>` 后缀（`标题 – 站点名`）、简易顶栏品牌与侧栏品牌锁中的站点展示名 */
	siteName: string;
	/** 文档布局侧栏 `rail-header` 品牌锁中的分区名；404 多语言侧栏时各语言行用对应语言文案 */
	railSiteLabel: string;
	/** 全站首条「跳到正文」跳过链接的可见文本 */
	skipToContent: string;
	/** 顶栏 / 抽屉栏主题切换按钮的 `aria-label`；404 客户端 `i18n-404` 会同步 DOM */
	themeToggleAria: string;
	/** 主题切换旁锚定悬浮提示的可见文案；404 客户端同步 */
	themeToggleHint: string;
	/** 无侧栏简易顶栏内主导航 `nav.topbar__nav` 的 `aria-label`（如首页布局） */
	topNavAria: string;
	/** 简易顶栏指向文档首页的「文档」链接文本 */
	topNavDocs: string;
	/** 文档页左侧 `#doc-rail` 侧栏容器的 `aria-label`；404 客户端同步 */
	docNavAria: string;
	/** 侧栏可折叠目录 `nav.rail-nav` 的 `aria-label`；404 多语言目录栈内 `RailNavSections` 使用 */
	railNavAria: string;
	/** 侧栏底栏指向文档首页的链接文案（与 `railSiteLabel` 同语义分区） */
	railFooterDocs: string;
	/** 侧栏底栏「社区集市」外链的可见文本 */
	railFooterBazaar: string;
	/** 侧栏底栏「官网」外链的可见文本 */
	railFooterOfficial: string;
	/** 正文顶栏面包屑 `nav.breadcrumbs` 的 `aria-label` */
	breadcrumbsAria: string;
	/** `CopyPageMarkdownToolbar` 主复制按钮的 `aria-label`；404 客户端同步 */
	copyPageMdAria: string;
	/** 复制工具栏主按钮旁提示条文案；404 客户端同步 */
	copyPageHint: string;
	/** 复制工具栏「更多」菜单触发器的 `aria-label`；404 客户端同步 */
	copyMenuMoreTitle: string;
	/** 复制菜单内「复制页面」项标题；404 客户端同步 */
	copyMenuMdTitle: string;
	/** 复制菜单内「复制页面」项说明；404 客户端同步 */
	copyMenuMdDesc: string;
	/** 复制菜单内「查看 Markdown」项标题；404 客户端同步 */
	copyMenuViewTitle: string;
	/** 复制菜单内「查看 Markdown」项说明；404 客户端同步 */
	copyMenuViewDesc: string;
	/** 窄屏打开文档侧栏的汉堡按钮默认 `aria-label`；404 客户端同步 */
	railMenuOpenAria: string;
	/** 侧栏打开时同一按钮的 `aria-label`（与 `data-aria-when-open` 配对）；404 客户端同步 */
	railMenuCloseAria: string;
	/** 正文右侧「本页目录」`aside.toc` 的 `aria-label` */
	tocAsideAria: string;
	/** 语言切换按钮与面板的 `aria-label`；404 客户端同步 */
	langSwitcherAria: string;
	/** 语言切换旁锚定悬浮提示的可见文案；404 客户端同步 */
	langSwitcherHint: string;
	/** `getDeveloperDocsNavGroups` 侧栏「入门 / intro」分组的折叠标题 */
	navIntro: string;
	/** `getDeveloperDocsNavGroups` 侧栏「插件」分组的折叠标题 */
	navPlugin: string;
	/** `getDeveloperDocsNavGroups` 侧栏「主题」分组的折叠标题 */
	navTheme: string;
	/** 文档页面包屑中当前文档所属分组名（键为 `NavGroupKey`） */
	navGroup: Record<NavGroupKey, string>;
	/** `PagefindToolbarTrigger` 占位与触发器旁可见的「搜索」提示 */
	searchHint: string;
	/** Pagefind 搜索圆形按钮的 `aria-label`（与占位提示配套）；404 客户端同步 */
	searchOpenAria: string;
	/** `404.astro` 的 `<title>` 主段及 `not-found-locale-boot-payload` 拼 `title` 时的「未找到」标题 */
	shellTitle: string;
	/** `404.astro` 的 `<meta name="description">` 与补丁 `description` 来源 */
	shellDescription: string;
	/** 404 正文对应语言区块的一级标题 */
	heading: string;
	/** 404 正文对应语言区块的说明段落 */
	body: string;
	/** 404 正文「打开文档首页」主按钮的可见文本 */
	button: string;
	/** 404 单屑面包屑中当前页 `span.breadcrumbs__current` 的可见标签（`notFound.crumbLabels`） */
	crumbLabel: string;
};

/** `.prose pre` 代码块复制脚本（`code-block-copy`）注入按钮在各状态下的 `aria-label` */
export type CodeBlockCopyUi = {
	/** 空闲态：复制按钮默认 `aria-label` */
	copyAria: string;
	/** 复制成功反馈约 1.6s 内的 `aria-label` */
	copiedAria: string;
	/** 剪贴板失败或空内容时的 `aria-label` */
	failedAria: string;
};

/**
 * 客户端按界面语言写入 head / 壳层 DOM 的文案补丁（与 `window.__NF_LOCALE__.patchByLocale` 各项一致）。
 * 通过 `Pick` 复用 `ShellUi` 字段，避免与主文案类型重复罗列键名；Pick 内各键含义与 `ShellUi` 同名字段一致，由 `i18n-404` 写入对应 DOM。
 */
export type ClientShellUiLocalePatch = Pick<
	ShellUi,
	| 'docNavAria'
	| 'skipToContent'
	| 'railSiteLabel'
	| 'themeToggleAria'
	| 'themeToggleHint'
	| 'copyPageMdAria'
	| 'copyPageHint'
	| 'copyMenuMoreTitle'
	| 'copyMenuMdTitle'
	| 'copyMenuMdDesc'
	| 'copyMenuViewTitle'
	| 'copyMenuViewDesc'
	| 'langSwitcherAria'
	| 'langSwitcherHint'
	| 'railMenuOpenAria'
	| 'railMenuCloseAria'
	| 'searchHint'
	| 'searchOpenAria'
> & {
	/** `i18n-404` 写入的完整 `<title>`（由 `shellTitle` 与 `siteName` 拼接） */
	title: string;
	/** `i18n-404` 写入 `<meta name="description">` 的正文 */
	description: string;
	/** `i18n-404` 设置 `<pagefind-config lang>`，与所选界面语言一致 */
	pagefindLang: string;
};

/** `window.__NF_LOCALE__` 内联载荷（壳层 head 同步与 404 客户端脚本共用） */
export type ClientShellLocaleWindowPayload = {
	/** 静态站点 `import.meta.env.BASE_URL`，供客户端拼文档路径 */
	base: string;
	/** 按 `AppLocale` 分组的壳层 / head 文案补丁，供非默认语言的 404 首屏切换 */
	patchByLocale: Record<AppLocale, ClientShellUiLocalePatch>;
};
