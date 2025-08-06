<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';

	let { children, class: className, ...others }: HTMLAnchorAttributes = $props();
</script>

<a
	class={`text-mm-blue hover:text-mm-blue-light inline-flex cursor-pointer items-end space-x-2 underline transition-all ${className}`}
	{...others}
>
	{@render children?.()}
	{#if others.target == '_blank'}
		<FluentOpen20Filled />
	{/if}
</a>
