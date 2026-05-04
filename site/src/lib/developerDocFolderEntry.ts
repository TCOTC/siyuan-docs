import { developerPageRelativePath } from './docRoutes';
import { firstDeveloperDocRelPathForFolder, type DeveloperNavFolderKey } from './doc-reading-frame';
import type { AppLocale } from './appLocale';

/** 站点自定义 404 页 href（含 `base`），无可用跳转目标时使用 */
export function siteNotFoundHref(): string {
	const b = import.meta.env.BASE_URL;
	return b.endsWith('/') ? `${b}404` : `${b}/404`;
}

/**
 * 开发者文档「仅目录」入口的目标 href：`root` 为侧栏首篇；`intro` / `plugin` / `theme` 为对应子目录首篇。
 */
export async function redirectHrefForDeveloperDocFolder(
	locale: AppLocale,
	folder: 'root' | DeveloperNavFolderKey,
): Promise<string | null> {
	const rel = await firstDeveloperDocRelPathForFolder(locale, folder);
	if (!rel) return null;
	return developerPageRelativePath(locale, rel);
}
