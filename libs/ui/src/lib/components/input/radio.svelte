<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export interface RadioProps extends HTMLInputAttributes {
		class?: string;
		selected?: string;
		options?: { label: string; value: string }[];
	}

	let {
		children,
		class: className,
		name = undefined,
		selected = $bindable(''),
		options = [],
		...others
	}: RadioProps = $props();

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

<div class="flex w-full flex-col space-y-2">
	{@render children?.()}
	{#each options as { value, label }}
		<div class="flex w-full cursor-pointer items-center space-x-2">
			<input
				bind:group={selected}
				type="radio"
				{value}
				id={slugify(label)}
				class={`focus:border-mm-blue size-6 cursor-pointer appearance-none border-2 border-gray-600 bg-transparent accent-gray-500 hover:border-gray-500 focus:ring-0 focus:ring-offset-0 ${className}`}
				{...others}
			/>
			<label class="cursor-pointer text-base" for={slugify(label)}>{label}</label>
		</div>
	{/each}
</div>
