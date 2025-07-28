<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentErrorCircle20Filled from '~icons/fluent/error-circle-20-filled';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface InputProps extends HTMLAttributes<HTMLDivElement> {
		componentSize?: Props['size'];
		class?: string;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	let { children, componentSize = 'md', class: className, ...others }: InputProps = $props();
</script>

<div
	class={`group relative flex h-min w-full items-center text-red-400 rounded-full ${sizeClasses[componentSize]} border-2 border-red-400 outline-0 ${className}`}
	{...others}
>
	<FluentErrorCircle20Filled class="size-8 min-h-8 min-w-8 mr-2" />
	{@render children?.()}
</div>
