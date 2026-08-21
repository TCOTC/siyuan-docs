<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { ChevronDown, Copy, Check, X } from '@lucide/vue';
import AnchoredHint from './AnchoredHint.vue';
import MenuPanel from './MenuPanel.vue';
import MenuPanelItem from './MenuPanelItem.vue';
import type { ShellUi } from '../i18n/types';

const props = defineProps<{
	mdViewHref: string;
	open: boolean;
	t: Pick<
		ShellUi,
		'copyPage' | 'copyMenuMoreTitle' | 'copyMenuMdTitle' | 'copyMenuViewTitle' | 'copyMenuViewDesc'
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

async function copyWithFeedback(): Promise<void> {
	emit('close');
	try {
		const res = await fetch(props.mdViewHref);
		if (!res.ok) {
			flashCopyFeedback(false);
			return;
		}
		const text = (await res.text()).replace(/^\uFEFF/, '').trim();
		if (!text) {
			flashCopyFeedback(false);
			return;
		}
		await navigator.clipboard.writeText(text);
		flashCopyFeedback(true);
	} catch {
		flashCopyFeedback(false);
	}
}

onUnmounted(() => {
	window.clearTimeout(copyFeedbackTimer);
});
</script>

<template>
	<div class="copy-split" data-header-menu="copy">
		<AnchoredHint :text="t.copyPage">
			<button
				type="button"
				class="copy-split__main"
				id="copy-page-md"
				:class="{
					'copy-split__main--success': copyState === 'success',
					'copy-split__main--error': copyState === 'error',
				}"
				:aria-label="t.copyPage"
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
			<MenuPanel id="copy-page-menu" :open="open">
				<MenuPanelItem @click="copyWithFeedback">
					{{ t.copyMenuMdTitle }}
					<template #desc>{{ t.copyPage }}</template>
				</MenuPanelItem>
				<MenuPanelItem
					:href="mdViewHref"
					target="_blank"
					rel="noopener noreferrer"
					@click="emit('close')"
				>
					{{ t.copyMenuViewTitle }}
					<template #desc>{{ t.copyMenuViewDesc }}</template>
				</MenuPanelItem>
			</MenuPanel>
		</div>
	</div>
</template>

<style scoped lang="scss">
.copy-split {
	display: inline-flex;
	align-items: stretch;
	min-height: var(--tool-h);
	height: var(--tool-h);
	border-radius: var(--r-pill);
	border: var(--sp-line) solid var(--line);
	background: var(--canvas);
	overflow: visible;
	flex-shrink: 0;
	box-sizing: border-box;

	html[data-theme='dark'] & {
		background: rgba(255, 255, 255, 0.03);
	}

	:deep(.hint) {
		flex: 1;
		min-width: 0;
		align-self: stretch;
	}
}

.copy-split__main {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 1;
	min-width: 0;
	gap: var(--sp-2);
	height: 100%;
	min-height: 100%;
	padding: 0 var(--sp-3);
	font-family: inherit;
	font-size: var(--tp-sm);
	font-weight: 510;
	line-height: 1;
	color: var(--ink-dim);
	background: transparent;
	border: none;
	border-top-left-radius: var(--r-pill);
	border-bottom-left-radius: var(--r-pill);
	cursor: pointer;

	&:hover {
		color: var(--ink);
		background: var(--muted);
	}

	html[data-theme='dark'] &:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	svg {
		flex-shrink: 0;
		opacity: 0.85;
	}

	&--success {
		.copy-split__main-icon--copy {
			display: none;
		}

		.copy-split__main-icon--check {
			display: flex;
		}
	}

	&--error {
		.copy-split__main-icon--copy {
			display: none;
		}

		.copy-split__main-icon--fail {
			display: flex;

			svg {
				color: #e11d48;
				opacity: 1;
			}
		}

		html[data-theme='dark'] & .copy-split__main-icon--fail svg {
			color: #fb7185;
		}
	}
}

.copy-split__main-icons {
	display: inline-grid;
	place-items: center;
	flex-shrink: 0;
}

.copy-split__main-icon {
	grid-area: 1 / 1;
	display: flex;
	align-items: center;
	justify-content: center;

	&--check,
	&--fail {
		display: none;
	}
}

.copy-split__chev {
	display: flex;
	align-items: center;
	justify-content: center;
	width: var(--sp-6);
	min-height: 100%;
	height: 100%;
	padding: 0;
	color: var(--ink-faint);
	background: transparent;
	border: none;
	border-top-right-radius: var(--r-pill);
	border-bottom-right-radius: var(--r-pill);
	cursor: pointer;

	&:hover {
		color: var(--ink);
		background: var(--muted);
	}

	html[data-theme='dark'] &:hover {
		background: rgba(255, 255, 255, 0.05);
	}
}

.copy-split__divider {
	width: var(--sp-line);
	background: var(--line);
	flex-shrink: 0;
}

.copy-split__menu {
	position: relative;
	display: flex;
}
</style>
