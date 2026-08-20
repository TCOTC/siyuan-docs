/** @typedef {{ key: string, pages: string[] | null, labels: Record<string, string> }} NavYmlEntry */

function unquote(value) {
	const t = value.trim();
	if (t.length >= 2 && ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'")))) {
		return t.slice(1, -1);
	}
	return t;
}

/**
 * 解析侧栏 `nav.yml`：根级文档为 `{ key, pages: null }`，分组为 `{ key, pages, labels }`。
 * @param {string} text
 * @param {string} [filename]
 * @returns {NavYmlEntry[]}
 */
export function parseNavYml(text, filename = 'nav.yml') {
	const entries = [];
	let current = null;
	const lines = text.split(/\r?\n/);
	for (let i = 0; i < lines.length; i++) {
		const raw = lines[i];
		const trimmed = raw.trim();
		if (!trimmed || trimmed.startsWith('#')) continue;
		const group = raw.match(/^- ([A-Za-z0-9_-]+):\s*$/);
		const root = raw.match(/^- ([A-Za-z0-9_-]+)\s*$/);
		const pagesKey = raw.match(/^ {2}pages:\s*$/);
		const page = raw.match(/^ {4}- ([A-Za-z0-9/_-]+)\s*$/);
		const label = raw.match(/^ {2}([A-Za-z0-9._-]+):\s+(.+)$/);
		if (group) {
			current = { key: group[1], pages: [], labels: {} };
			entries.push(current);
			continue;
		}
		if (root) {
			current = { key: root[1], pages: null, labels: {} };
			entries.push(current);
			continue;
		}
		if (pagesKey) {
			if (!current || !current.pages) {
				throw new Error(`${filename}:${i + 1}: pages 必须写在分组下面`);
			}
			continue;
		}
		if (page) {
			if (!current || !current.pages) {
				throw new Error(`${filename}:${i + 1}: 页面条目必须写在分组的 pages 下面`);
			}
			current.pages.push(page[1]);
			continue;
		}
		if (label) {
			if (!current || !current.pages) {
				throw new Error(`${filename}:${i + 1}: 分组标题必须写在分组下面`);
			}
			current.labels[label[1]] = unquote(label[2]);
			continue;
		}
		throw new Error(`${filename}:${i + 1}: 无法解析「${raw}」`);
	}
	return entries;
}
