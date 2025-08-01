<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import SvgSpinnersBlocksShuffle3 from '~icons/svg-spinners/blocks-shuffle-3';

	interface Props {
		color: 'blue' | 'purple' | 'gray' | 'darkgray' | 'red' | 'green';
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface ButtonProps extends HTMLButtonAttributes {
		color?: Props['color'];
		size?: Props['size'];
		class?: string;
		loading?: boolean;
	}

	const colorClasses: { [K in Props['color']]: string } = {
		blue: 'bg-mm-blue enabled:hover:bg-mm-blue-light outline-mm-blue text-black',
		purple: 'bg-mm-purple enabled:hover:bg-mm-purple-light outline-mm-purple text-black',
		red: 'bg-red-500 enabled:hover:bg-red-400 outline-red-500 text-black',
		gray: 'bg-gray-600 enabled:hover:bg-gray-500 outline-gray-600 text-white',
		darkgray: 'bg-gray-800 enabled:hover:bg-gray-700 outline-gray-800 text-white',
		green: 'bg-mm-green enabled:hover:bg-mm-green-light outline-mm-green text-black',
	};

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	let {
		children,
		color = 'blue',
		size = 'md',
		class: className,
		loading,
		...others
	}: ButtonProps = $props();
</script>

<button
	class={`${colorClasses[color]} group relative flex h-min w-min cursor-pointer items-center space-x-2 rounded-lg ${sizeClasses[size]} text-nowrap outline-0 transition-all enabled:hover:shadow-lg enabled:focus:outline-2 enabled:focus:outline-offset-2 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 font-bold ${className}`}
	{...others}
>
	{#if loading}
		<div class="flex w-full h-full justify-center items-center left-0 top-0 absolute z-10">
			<SvgSpinnersBlocksShuffle3 />
		</div>
	{/if}
	<div class={`${loading ? 'opacity-0' : 'opacity-100'} flex items-center text-nowrap space-x-2`}>
		{@render children?.()}
	</div>
</button>
