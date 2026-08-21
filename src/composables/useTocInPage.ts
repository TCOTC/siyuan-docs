import { onMounted, onUnmounted, type Ref } from 'vue';

/** 本页目录：标题进入视口上半区时高亮对应 `li` */
export function useTocInPage(
	tocList: Ref<HTMLElement | null>,
	main: Ref<HTMLElement | null>,
): { tocSync: () => void } {
	let io: IntersectionObserver | null = null;
	const visible = new Set<string>();

	function headings(): HTMLElement[] {
		const list = tocList.value;
		const docMain = main.value;
		if (!list || !docMain) return [];
		const wanted = new Set<string>();
		for (const a of list.querySelectorAll('a[href^="#"]')) {
			const id = (a.getAttribute('href') ?? '').slice(1);
			if (id) wanted.add(id);
		}
		const out: HTMLElement[] = [];
		for (const he of docMain.querySelectorAll('h2[id], h3[id], h4[id]')) {
			if (he instanceof HTMLElement && wanted.has(he.id)) out.push(he);
		}
		return out;
	}

	function paint(): void {
		const list = tocList.value;
		if (!list) return;
		const ordered = headings();
		let activeId = '';
		for (const h of ordered) {
			if (visible.has(h.id)) activeId = h.id;
		}
		if (!activeId) {
			for (const h of ordered) {
				if (h.getBoundingClientRect().top <= 8) activeId = h.id;
			}
		}
		if (!activeId) activeId = ordered[0]?.id ?? '';

		for (const li of list.querySelectorAll('li')) {
			const a = li.querySelector('a[href^="#"]');
			if (!(a instanceof HTMLElement)) continue;
			const href = a.getAttribute('href') ?? '';
			const id = href.startsWith('#') ? href.slice(1) : '';
			const on = id !== '' && id === activeId;
			li.classList.toggle('is-active', on);
			if (on) a.setAttribute('aria-current', 'location');
			else a.removeAttribute('aria-current');
		}
	}

	function tocSync(): void {
		io?.disconnect();
		io = null;
		visible.clear();
		if (import.meta.env.SSR) return;
		const items = headings();
		if (items.length === 0) {
			paint();
			return;
		}
		io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (!(e.target instanceof HTMLElement) || !e.target.id) continue;
					if (e.isIntersecting) visible.add(e.target.id);
					else visible.delete(e.target.id);
				}
				paint();
			},
			{ rootMargin: '0px 0px -65% 0px', threshold: 0 },
		);
		for (const h of items) io.observe(h);
		paint();
	}

	onMounted(tocSync);
	onUnmounted(() => {
		io?.disconnect();
		io = null;
	});
	return { tocSync };
}
