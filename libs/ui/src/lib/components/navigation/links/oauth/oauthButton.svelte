<script lang="ts">
	import { LinkButton } from '../index.js';
	import { type LinkButtonProps } from '../linkButton.svelte';
	import { Loader } from '$lib/components/misc/index.js';

	export interface OAuthButtonProps extends LinkButtonProps {
		loading?: boolean;
	}

	let {
		children,
		color = 'white',
		size = 'md',
		class: className,
		loading = false,
		...others
	}: OAuthButtonProps = $props();
</script>

<LinkButton
	class="relative flex w-full! items-end justify-center overflow-clip text-center"
	{size}
	{color}
	{...others}
>
	{#if loading}
		<div
			class="absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center bg-black/80 text-white"
		>
			<Loader {size} />
		</div>
	{/if}
	{@render children?.()}
</LinkButton>
