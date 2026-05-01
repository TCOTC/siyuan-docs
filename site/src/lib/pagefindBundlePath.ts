/**
 * 与已安装的 `pagefind` npm 包版本一致（构建时由 Vite `define` 写入 `__PAGEFIND_LIB_VERSION__`）。
 * 用于页面上的 bundle 路径；升级依赖后值会变，避免与旧版 WASM/JS 混缓存。
 */
export function getPagefindLibVersion(): string {
	return __PAGEFIND_LIB_VERSION__;
}
