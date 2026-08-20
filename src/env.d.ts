/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue';
	const component: DefineComponent<object, object, unknown>;
	export default component;
}

declare module '*.json' {
	const value: unknown;
	export default value;
}

declare namespace JSX {
	interface IntrinsicElements {
		'pagefind-config': Record<string, unknown>;
		'pagefind-modal': Record<string, unknown>;
		'pagefind-modal-trigger': Record<string, unknown>;
	}
}
