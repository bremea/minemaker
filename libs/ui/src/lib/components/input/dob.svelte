<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props {
		size: 'sm' | 'md' | 'lg' | 'xl';
	}

	export interface DOBProps extends HTMLSelectAttributes {
		componentSize?: Props['size'];
		class?: string;
		stretchHeight?: boolean;
		month?: number;
		day?: number;
		year?: number;
	}

	const sizeClasses: { [K in Props['size']]: string } = {
		sm: 'px-4 py-1 text-sm',
		md: 'px-6 py-2 text-base',
		lg: 'px-8 py-3 text-lg',
		xl: 'px-10 py-4 text-xl'
	};

	let days: number[] = $state([]);

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let {
		children,
		componentSize = 'md',
		class: className,
		month = $bindable(new Date().getMonth()),
		day = $bindable(new Date().getDate()),
		year = $bindable(new Date().getFullYear()),
		required = false,
		stretchHeight = false,
		...others
	}: DOBProps = $props();

	const updateDays = () => {
		days = Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);
	};

	$effect(updateDays);
	onMount(updateDays);
</script>

<div class={`flex flex-col ${stretchHeight ? 'h-full' : ''}`}>
	{#if children != undefined}
		<label class="mb-1.5 text-base"
			>{@render children?.()}{#if required}<span class="ml-1 text-red-400">*</span>{/if}</label
		>
	{/if}
	<div class="flex space-x-2">
		<select
			placeholder="Month"
			class={`group relative flex h-min w-full items-center space-x-2 rounded-lg ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
			bind:value={month}
			{...others}
		>
			{#each months as month, i}
				<option value={i + 1}>{month}</option>
			{/each}
		</select>
		<select
			placeholder="Day"
			class={`group relative flex h-min w-full items-center space-x-2 rounded-lg ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
			bind:value={day}
			{...others}
		>
			{#each days as day}
				<option value={day}>{day}</option>
			{/each}
		</select>
		<select
			placeholder="Year"
			class={`group relative flex h-min w-full items-center space-x-2 rounded-lg ${sizeClasses[componentSize]} focus:border-mm-blue border-2 border-gray-600 bg-gray-900 text-nowrap outline-0 transition-all hover:border-gray-500 hover:shadow-lg focus:bg-gray-900 ${className}`}
			bind:value={year}
			{...others}
		>
			{#each Array.from({ length: 121 }, (_, i) => new Date().getFullYear() - i) as yearOption}
				<option value={yearOption}>{yearOption}</option>
			{/each}
		</select>
	</div>
</div>
