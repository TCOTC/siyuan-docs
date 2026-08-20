<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { ChevronDown, Copy, Check, X } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import type { ShellUi } from '../i18n/types';
import { copyPageMarkdown } from '../lib/pageMarkdown';

defineProps<{
	mdViewHref: string;
	open: boolean;
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

const emit = defineEmits<{
	toggle: [];
	close: [];
}>();

const copyState = ref<'idle' | 'success' | 'error'>('idle');
let copyFeedbackTimer: number | undefined;

function flashCopyFeedback(success: boolean): void {
	copyState.value = success ? 'success' : 'error';
	window.clearTimeout(copyFeedbackTimer);
	copyFeedbackTimer = window.setTimeout(() => {
		copyState.value = 'idle';
	}, 1600);
}

function copyWithFeedback(): void {
	emit('close');
	void copyPageMarkdown().then(flashCopyFeedback);
}

onUnmounted(() => {
	window.clearTimeout(copyFeedbackTimer);
});
</script>

<template>
	<div class="copy-split" data-header-menu="copy">
		<AnchoredHint class="hint--grow" :text="t.copyPageHint">
			<button
				type="button"
				class="copy-split__main"
				id="copy-page-md"
				data-floating-hint-anchor
				:class="{
					'copy-split__main--success': copyState === 'success',
					'copy-split__main--error': copyState === 'error',
				}"
				:aria-label="t.copyPageMdAria"
				@click="copyWithFeedback"
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
		</AnchoredHint>
		<span class="copy-split__divider" aria-hidden="true" />
		<div class="copy-split__menu">
			<button
				type="button"
				class="copy-split__chev"
				id="copy-page-menu-btn"
				:aria-expanded="open ? 'true' : 'false'"
				aria-haspopup="true"
				aria-controls="copy-page-menu"
				:aria-label="t.copyMenuMoreTitle"
				@click="emit('toggle')"
			>
				<ChevronDown :size="16" />
			</button>
			<ul
				class="copy-split__panel"
				id="copy-page-menu"
				role="menu"
				:hidden="!open"
				:class="{ 'is-open': open }"
			>
				<li role="presentation">
					<button type="button" role="menuitem" class="copy-split__panel-item" @click="copyWithFeedback">
						<span class="copy-split__panel-item__title">{{ t.copyMenuMdTitle }}</span>
						<span class="copy-split__panel-item__desc">{{ t.copyMenuMdDesc }}</span>
					</button>
				</li>
				<li role="presentation">
					<a
						role="menuitem"
						class="copy-split__panel-item"
						:href="mdViewHref"
						target="_blank"
						rel="noopener noreferrer"
						@click="emit('close')"
					>
						<span class="copy-split__panel-item__title">{{ t.copyMenuViewTitle }}</span>
						<span class="copy-split__panel-item__desc">{{ t.copyMenuViewDesc }}</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>
