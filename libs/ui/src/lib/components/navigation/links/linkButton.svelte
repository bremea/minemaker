<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface LinkButtonPropOptions {
		color: 'blue' | 'purple' | 'gray' | 'darkgray' | 'white' | 'discord' | 'green';
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface LinkButtonProps extends HTMLAnchorAttributes {
		color?: LinkButtonPropOptions['color'];
		size?: LinkButtonPropOptions['size'];
		class?: string;
	}

	const colorClasses: { [K in LinkButtonPropOptions['color']]: string } = {
		blue: 'bg-mm-blue hover:bg-mm-blue-light outline-mm-blue text-black',
		purple: 'bg-mm-purple hover:bg-mm-purple-light outline-mm-purple text-black',
		gray: 'bg-gray-600 hover:bg-gray-500 outline-gray-600 text-white',
		darkgray: 'bg-gray-800 hover:bg-gray-700 outline-gray-800 text-white',
		white: 'bg-white hover:bg-gray-200 outline-white text-black',
		discord: 'bg-[#5865F2] hover:bg-[#7289DA] outline-[#5865F2] text-white',
		green: 'bg-mm-green enabled:hover:bg-mm-green-light outline-mm-green text-black'
	};

	const sizeClasses: { [K in LinkButtonPropOptions['size']]: string } = {
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
		...others
	}: LinkButtonProps = $props();
</script>

<a
	class={`${colorClasses[color]} group relative flex h-min w-min cursor-pointer items-center space-x-2 rounded-lg ${sizeClasses[size]} text-nowrap font-bold outline-0 transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95 ${className}`}
	{...others}
>
	{@render children?.()}
</a>
