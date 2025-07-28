<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface TextareaProps extends HTMLTextareaAttributes {
		componentSize?: Props['size'];
		class?: string;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base min-h-[42px]',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	$effect(() => {
		if (maxlength && (value as string).length > maxlength) {
			value = (value as string).substring(0, maxlength);
		}
	});

	let {
		children,
		componentSize = 'md',
		class: className,
		value = $bindable(''),
		maxlength = undefined,
		...others
	}: TextareaProps = $props();
</script>

<div class="flex flex-col">
	<label class="pb-1.5 pl-2 text-base">{@render children?.()}</label>
	<textarea
		bind:value
		class={`group relative flex h-min w-full items-center text-wrap space-x-2 rounded-lg ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
		{...others}
	></textarea>
	{#if maxlength}
		<span
			class={`w-full pt-0.5 pr-2 text-right text-xs ${(value as string).length == maxlength ? 'text-red-500' : 'text-gray-400'}`}
		>
			{(value as string).length}/{maxlength}
		</span>
	{/if}
</div>
