<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	export interface LinkButtonPropOptions {
		color: 'blue' | 'purple' | 'gray' | 'darkgray';
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
		darkgray: 'bg-gray-800 hover:bg-gray-700 outline-gray-800 text-white'
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
	class={`${colorClasses[color]} group relative flex h-min w-min cursor-pointer items-center space-x-2 rounded-lg ${sizeClasses[size]} text-nowrap outline-0 transition-all hover:shadow-lg focus:outline-2 focus:outline-offset-2 active:scale-95 ${className}`}
	{...others}
>
	{@render children?.()}
</a>
