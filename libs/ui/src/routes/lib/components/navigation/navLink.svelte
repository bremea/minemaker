<script lang="ts">
	import { page } from '$app/stores';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface NavLinkProps extends HTMLAnchorAttributes {
		class?: string;
		active?: boolean;
		href?: string;
	}

	$effect(() => {
		active = href ? $page.url.pathname.endsWith(href) : false; 
	});

	let {
		children,
		href,
		active = href ? $page.url.pathname.endsWith(href) : false,
		class: className,
		...others
	}: NavLinkProps = $props();
</script>

<a
	{href}
	class={`${active ? 'hover:bg-mm-blue-light bg-mm-blue font-bold text-black' : 'hover:bg-gray-900'} flex w-full cursor-pointer space-x-2 p-2 transition-all ${className}`}
	{...others}
>
	{@render children?.()}
</a>
