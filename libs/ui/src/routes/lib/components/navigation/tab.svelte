<script lang="ts">
	import { page } from '$app/stores';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';

	export interface TabProps extends HTMLAnchorAttributes {
		class?: string;
		active?: boolean;
		closeable?: boolean;
		href?: string;
		index: number;
		closeTab?: (index: number, switchIndex?: boolean) => void;
	}

	$effect(() => {
		active = href ? $page.url.pathname.endsWith(href) : false;
	});

	let {
		children,
		href,
		active = href ? $page.url.pathname.endsWith(href) : false,
		closeable = true,
		class: className,
		closeTab,
		index,
		...others
	}: TabProps = $props();
</script>

<a
	{href}
	class={`${active ? 'text-mm-blue bg-gray-600 shadow-[inset_0_-2px_0_0_var(--color-mm-blue)]' : 'hover:bg-gray-600/50'} group relative flex items-center space-x-4 ${closeable ? 'px-4' : 'p-4'} transition-all ${className}`}
	{...others}
>
	{@render children?.()}
	{#if closeable}
		<button
			class="absolute right-1 rounded-full p-1 transition-all hover:bg-gray-500"
			onclick={() => {
				if (closeTab) closeTab(index);
			}}
		>
			<FluentDismiss20Filled class="size-4 h-4 w-4 text-white" />
		</button>
	{/if}
</a>
