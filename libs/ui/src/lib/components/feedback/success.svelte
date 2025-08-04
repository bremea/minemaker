<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentCheckboxChecked20Filled from '~icons/fluent/checkbox-checked-20-filled';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface SuccessProps extends HTMLAttributes<HTMLDivElement> {
		componentSize?: Props['size'];
		class?: string;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	let { children, componentSize = 'md', class: className, ...others }: SuccessProps = $props();
</script>

<div
	class={`group relative flex h-min w-full items-center rounded-lg text-green-400 ${sizeClasses[componentSize]} border-2 border-green-400 outline-0 ${className}`}
	{...others}
>
	<FluentCheckboxChecked20Filled class="mr-2 size-8 min-h-8 min-w-8" />
	{@render children?.()}
</div>
