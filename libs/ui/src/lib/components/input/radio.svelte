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
		<div class="flex w-full items-center space-x-2 cursor-pointer">
			<input
				bind:group={selected}
				type="radio"
				{value}
				id={slugify(label)}
				class={`size-6 appearance-none cursor-pointer border-2 accent-gray-500 border-gray-600 bg-transparent hover:border-gray-500 focus:ring-0 focus:ring-offset-0 focus:border-mm-blue ${className}`}
				{...others}
			/>
			<label class="text-base cursor-pointer" for={slugify(label)}>{label}</label>
		</div>
	{/each}
</div>
