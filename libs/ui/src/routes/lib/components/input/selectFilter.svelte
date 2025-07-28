<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface SelectFilterProps extends HTMLInputAttributes {
		componentSize?: Props['size'];
		class?: string;
		options?: string[];
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	$effect(() => {});

	let {
		children,
		componentSize = 'md',
		class: className,
		options = [],
		value = $bindable(''),
		...others
	}: SelectFilterProps = $props();
</script>

<div class="flex flex-col">
	<label class="mb-1.5 ml-2 text-base">{@render children?.()}</label>
	<div class={`group relative h-min w-full justify-center space-y-2`}>
		<input
			class={`peer flex h-min w-full items-center space-x-2 rounded-full ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
			bind:value
			{...others}
		/>
		<div
			class="absolute left-0 z-20 hidden h-min max-h-32 w-full flex-col overflow-auto rounded-3xl border-2 border-gray-600 bg-gray-900 transition-all peer-focus:flex focus:flex"
		>
			{#each options as option}
				<button class={`w-full ${sizeClasses[componentSize]} transition-all hover:bg-gray-700`}>
					{option}
				</button>
			{/each}
		</div>
	</div>
</div>
