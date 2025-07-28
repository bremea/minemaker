<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface InputProps extends HTMLInputAttributes {
		componentSize?: Props['size'];
		class?: string;
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
		maxlength = undefined,
		...others
	}: InputProps = $props();
</script>

<div class="flex flex-col">
	<label class="pb-1.5 pl-2 text-base" for="tag">Tags</label>
	<input
		type="text"
		bind:value
		id="tag"
		class={`group relative flex h-min w-min items-center space-x-2 rounded-full ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
		{...others}
	/>
</div>
