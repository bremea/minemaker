<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentWarning20Filled from '~icons/fluent/warning-20-filled';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface InputProps extends HTMLAttributes<HTMLDivElement> {
		componentSize?: Props['size'];
		class?: string;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-0.5 text-sm',
		md: 'px-6 py-1 text-base',
		lg: 'px-8 py-2 text-lg',
		xl: 'px-10 py-3 text-xl'
	};

	let { children, componentSize = 'md', class: className, ...others }: InputProps = $props();
</script>

<div
	class={`group relative flex h-min w-full items-center justify-center space-x-2 rounded-lg ${sizeClasses[componentSize]} border-2 border-yellow-600 bg-gray-700 outline-0 ${className}`}
	{...others}
>
	<FluentWarning20Filled class="text-yellow-600 size-8" />
	{@render children?.()}
</div>
