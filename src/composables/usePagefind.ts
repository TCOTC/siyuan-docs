import { onMounted, toValue, type MaybeRefOrGetter } from 'vue';
import { closePagefindModal, ensurePagefindTriggers, startPagefindLoader } from '../lib/pagefind';

/** 挂载后按需加载 Pagefind；切页时由调用方关闭弹层并补挂 trigger */
export function usePagefind(bundle: MaybeRefOrGetter<string>): {
	closePagefindModal: () => void;
	ensurePagefindTriggers: () => void;
} {
	onMounted(() => {
		startPagefindLoader(toValue(bundle));
	});
	return { closePagefindModal, ensurePagefindTriggers };
}
