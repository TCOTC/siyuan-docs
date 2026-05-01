/**
 * F5 整页刷新：`history.scrollRestoration` 不负责恢复滚动；用 sessionStorage 在首帧同步 scrollTo（有保存值时，与 URL 是否含 `#` 无关）。
 * 后退 / 前进仍走浏览器，勿设 scrollRestoration = manual。键前缀与 `Shell` 首屏内联脚本、shell-ui 一致。
 */
export const DOC_SCROLL_SESSION_PREFIX = 'siyuan-docs:doc-scroll:v1:';
