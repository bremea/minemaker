<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface InputProps extends HTMLInputAttributes {
		componentSize?: Props['size'];
		class?: string;
		stretchHeight?: boolean;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	$effect(() => {
		if (maxlength && value.length > maxlength) {
			value = value.substring(0, maxlength);
		}
	});

	let {
		children,
		componentSize = 'md',
		class: className,
		value = $bindable(''),
		required = false,
		maxlength = undefined,
		stretchHeight = false,
		...others
	}: InputProps = $props();
</script>

<div class={`flex flex-col ${stretchHeight ? 'h-full' : ''}`}>
	{#if children != undefined}
		<label class="mb-1.5 text-base"
			>{@render children?.()}{#if required}<span class="ml-1 text-red-400">*</span>{/if}</label
		>
	{/if}
	<input
		bind:value
		class={`group relative flex h-min w-full items-center space-x-2 rounded-lg ${sizeClasses[componentSize]} focus:border-mm-blue text-nowrap border-2 border-gray-600 bg-gray-900 outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 autofill:bg-gray-900! ${className}`}
		{...others}
	/>
	{#if maxlength}
		<span
			class={`mr-2 mt-0.5 w-full text-right text-xs ${value.length == maxlength ? 'text-red-500' : 'text-gray-400'}`}
		>
			{value.length}/{maxlength}
		</span>
	{/if}
</div>
