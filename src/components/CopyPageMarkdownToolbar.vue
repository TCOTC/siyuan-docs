<script setup lang="ts">
import { ChevronDown, Copy, Check, X } from 'lucide-vue-next';
import type { ShellUi } from '../i18n/types';

defineProps<{
	mdViewHref: string;
	t: Pick<
		ShellUi,
		| 'copyPageMdAria'
		| 'copyPageHint'
		| 'copyMenuMoreTitle'
		| 'copyMenuMdTitle'
		| 'copyMenuMdDesc'
		| 'copyMenuViewTitle'
		| 'copyMenuViewDesc'
	>;
}>();
</script>

<template>
	<div class="copy-split">
		<div class="hint hint--grow" data-anchored-floating-hint>
			<button
				type="button"
				class="copy-split__main js-copy-page-md"
				id="copy-page-md"
				data-floating-hint-anchor
				:aria-label="t.copyPageMdAria"
			>
				<span class="copy-split__main-icons" aria-hidden="true">
					<span class="copy-split__main-icon copy-split__main-icon--copy">
						<Copy :size="16" />
					</span>
					<span class="copy-split__main-icon copy-split__main-icon--check">
						<Check :size="16" />
					</span>
					<span class="copy-split__main-icon copy-split__main-icon--fail">
						<X :size="16" />
					</span>
				</span>
			</button>
			<div class="hint__layer" data-floating-hint-layer role="tooltip">
				<span class="hint__txt">{{ t.copyPageHint }}</span>
			</div>
		</div>
		<span class="copy-split__divider" aria-hidden="true" />
		<div class="copy-split__menu">
			<button
				type="button"
				class="copy-split__chev"
				id="copy-page-menu-btn"
				aria-expanded="false"
				aria-haspopup="true"
				aria-controls="copy-page-menu"
				:aria-label="t.copyMenuMoreTitle"
			>
				<ChevronDown :size="16" />
			</button>
			<ul class="copy-split__panel" id="copy-page-menu" role="menu" hidden>
				<li role="presentation">
					<button type="button" role="menuitem" class="copy-split__panel-item" id="copy-page-menu-md">
						<span class="copy-split__panel-item__title">{{ t.copyMenuMdTitle }}</span>
						<span class="copy-split__panel-item__desc">{{ t.copyMenuMdDesc }}</span>
					</button>
				</li>
				<li role="presentation">
					<a
						role="menuitem"
						class="copy-split__panel-item"
						id="copy-page-view-md"
						:href="mdViewHref"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span class="copy-split__panel-item__title">{{ t.copyMenuViewTitle }}</span>
						<span class="copy-split__panel-item__desc">{{ t.copyMenuViewDesc }}</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>
