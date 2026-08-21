import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/** 客户端订阅 matchMedia；SSR / 首帧使用 `initial` */
export function useMediaQuery(query: string, initial = false): Ref<boolean> {
	const matches = ref(initial);
	let mql: MediaQueryList | null = null;
	const onChange = (e: MediaQueryListEvent): void => {
		matches.value = e.matches;
	};
	onMounted(() => {
		mql = window.matchMedia(query);
		matches.value = mql.matches;
		mql.addEventListener('change', onChange);
	});
	onUnmounted(() => {
		mql?.removeEventListener('change', onChange);
	});
	return matches;
}
