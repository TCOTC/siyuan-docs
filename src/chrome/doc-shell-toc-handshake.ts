/**
 * 仅存在于 `shell-after-load` 包内：`runDocShellBootstrap` 与 `shell-ui` 本页目录初始化之间的一次性握手，
 * 避免首帧重复 `tocSync` / `tocSchedule`；勿改用 `window`，以免与独立 IIFE 脚本产生隐式顺序依赖。
 */

let shellBootstrapAlreadyRanTocSync = false;

export function markShellBootstrapRanTocSync(): void {
	shellBootstrapAlreadyRanTocSync = true;
}

/**
 * 若首帧 bootstrap 已执行过 `tocSync`，返回 true 并清除标志，使 `shell-ui` 跳过首次 `tocSchedule`。
 */
export function consumeShellBootstrapRanTocSync(): boolean {
	if (!shellBootstrapAlreadyRanTocSync) return false;
	shellBootstrapAlreadyRanTocSync = false;
	return true;
}
