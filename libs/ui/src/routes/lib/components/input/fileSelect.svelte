<script lang="ts">
	import type { HTMLAttributes, MouseEventHandler } from 'svelte/elements';
	import FluentFolderOpen20Filled from '~icons/fluent/folder-open-20-filled';
	import Button from './buttons/button.svelte';
	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface InputProps extends HTMLAttributes<HTMLDivElement> {
		componentSize?: Props['size'];
		class?: string;
		value?: string;
		onselectclick?: MouseEventHandler<HTMLButtonElement>;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	const buttonSizes: { [K in Props['size']]: string } = {
		sm: 'size-4',
		md: 'size-6',
		lg: 'size-8',
		xl: 'size-10'
	};

	let {
		children,
		componentSize = 'md',
		class: className,
		onselectclick = () => {},
		value = $bindable('/'),
		...others
	}: InputProps = $props();
</script>

<div class="flex flex-col">
	<label class="pb-1.5 pl-2 text-base">{@render children?.()}</label>
	<div class="flex h-min w-full space-x-2">
		<div
			class={`group relative flex h-min w-full items-center space-x-2 rounded-full ${sizeClasses[componentSize]} border-2 border-gray-600 bg-gray-900 leading-tight text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
			{...others}
		>
			<span class="m-0 p-0">{value}</span>
		</div>

		<Button type="button" color="gray" size={componentSize} class="h-full" onclick={onselectclick}>
			<FluentFolderOpen20Filled class={buttonSizes[componentSize]} />
		</Button>
	</div>
</div>
