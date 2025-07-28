<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Tab } from './index.js';
	import HomeTab from './homeTab.svelte';

	export type OpenTabList = { label: string; href: string }[];
	export type OpenTabFunction = (
		label: string,
		href: string,
		switchIndex?: boolean
	) => Promise<void>;
	export type CloseTabFunction = (index: number, switchIndex?: boolean) => Promise<void>;

	export interface TabContainerProps extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		withHomeTab?: boolean;
		openTabs: OpenTabList;
		openTab: OpenTabFunction;
		closeTab: CloseTabFunction;
	}

	let {
		children,
		class: className,
		withHomeTab = false,
		openTabs,
		openTab,
		closeTab,
		...others
	}: TabContainerProps = $props();
</script>

<div class={`flex h-10 w-max ${className}`} {...others}>
	{#key openTabs.length}
		{#if withHomeTab}
			<HomeTab index={-1} />
		{/if}
		{#each openTabs as tab, index}
			<Tab href={tab.href} {index} {closeTab}>
				<p>{tab.label}</p>
			</Tab>
		{/each}
	{/key}
</div>
