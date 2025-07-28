<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FluentDismiss12Filled from '~icons/fluent/dismiss-12-filled';
	import FluentCheckmark12Filled from '~icons/fluent/checkmark-12-filled';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface PasswordProps extends HTMLInputAttributes {
		componentSize?: Props['size'];
		class?: string;
		stretchHeight?: boolean;
		regex?: RegExp;
		rules?: { pattern: RegExp; label: string }[];
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
		regex = undefined,
		rules = [],
		...others
	}: PasswordProps = $props();

	let regexError = $state(false);

	$effect(() => {
		if (!regex) return;
		regexError = !regex.test(value);
	});
</script>

<div class={`flex flex-col ${stretchHeight ? 'h-full' : ''}`}>
	{#if children != undefined}
		<label class="mb-1.5 text-base"
			>{@render children?.()}{#if required}<span class="ml-1 text-red-400">*</span>{/if}</label
		>
	{/if}
	<input
		bind:value
		type="password"
		class={`group relative flex h-min w-full items-center space-x-2 rounded-lg ${sizeClasses[componentSize]} text-nowrap border-2 ${regexError ? 'border-red-400 hover:border-red-300' : 'border-gray-600 hover:border-gray-500'} focus:border-mm-blue bg-gray-900 outline-0 transition-all hover:shadow-lg focus:bg-gray-900 ${className}`}
		{...others}
	/>
	<ul class="pl-2 pt-2">
		{#each rules as rule}
			<li class="flex items-end space-x-1 text-sm">
				{#if rule.pattern.test(value)}
					<FluentCheckmark12Filled class="text-green-400" />
				{:else}
					<FluentDismiss12Filled class="text-red-400" />
				{/if}
				<span class={rule.pattern.test(value) ? 'text-gray-400' : 'text-red-400'}>{rule.label}</span
				>
			</li>
		{/each}
	</ul>
	{#if maxlength}
		<span
			class={`mr-2 mt-0.5 w-full text-right text-xs ${value.length == maxlength ? 'text-red-500' : 'text-gray-400'}`}
		>
			{value.length}/{maxlength}
		</span>
	{/if}
</div>
