/**
 * 与 theme-boot 的 data-device、搜索快捷键文案一致：
 * userAgentData.platform 优先，否则回退 UA。
 */
type NavigatorWithUAData = Navigator & {
	userAgentData?: { platform: string };
};

export function isApplePlatform(): boolean {
	const ua = (navigator as NavigatorWithUAData).userAgentData?.platform;
	if (ua === 'macOS' || ua === 'iOS') return true;
	return /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent);
}
