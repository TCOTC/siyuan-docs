import type { Parent, Root, Text } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * 去掉仅含空白、且夹在两个元素节点之间的文本节点，收紧 Markdown 输出的 HTML。
 * 不影响 `<pre>` 内文本（其为元素子树内的空白或非「元素-元素」夹缝）。
 */
export default function rehypeStripInterElementWhitespace(): (tree: Root) => void {
	return (tree: Root): void => {
		const toRemove: { parent: Parent; index: number }[] = [];
		visit(tree, 'text', (node: Text, index, parent) => {
			if (!parent || typeof index !== 'number') return;
			if (!/^\s+$/.test(node.value)) return;
			const siblings = parent.children;
			const prev = siblings[index - 1];
			const next = siblings[index + 1];
			if (prev?.type === 'element' && next?.type === 'element') {
				toRemove.push({ parent, index });
			}
		});
		const byParent = new Map<Parent, number[]>();
		for (const { parent, index } of toRemove) {
			const arr = byParent.get(parent) ?? [];
			arr.push(index);
			byParent.set(parent, arr);
		}
		for (const [parent, indices] of byParent) {
			const sorted = [...indices].sort((a, b) => b - a);
			for (const i of sorted) {
				parent.children.splice(i, 1);
			}
		}
	};
}
