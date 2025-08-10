<script lang="ts">
	import { type Game } from '@minemaker/db';
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentErrorCircle20Filled from '~icons/fluent/error-circle-20-filled';
	import { GameTile } from '.';
	import { Loader } from '../misc';

	export interface GameSectionProps extends HTMLAttributes<HTMLDivElement> {
		label?: string;
		hrefPrefix?: string;
		error?: string;
		games: Game[];
		loading?: boolean;
	}

	let {
		games,
		loading = false,
		error = '',
		hrefPrefix,
		label,
		children,
		class: className
	}: GameSectionProps = $props();
</script>

<section class={`w-full space-y-4 ${className}`}>
	{#if label}
		<h2 class="text-2xl font-bold">{label}</h2>
	{:else}
		{@render children?.()}
	{/if}

	{#if loading}
		<div class="flex h-[200px] w-full items-center justify-center">
			<Loader />
		</div>
	{:else if error}
		<div class="flex h-[200px] w-full flex-col items-center justify-center space-y-2">
			<FluentErrorCircle20Filled class="size-10 text-gray-400" />
			<p class="text-center text-sm italic text-gray-400">
				{error}
			</p>
		</div>
	{:else if games.length > 0}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
			{#each games as game}
				<GameTile {game} href={hrefPrefix ? `${hrefPrefix}/${game.id}` : undefined} />
			{/each}
		</div>
	{:else}
		<div class="flex h-[200px] w-full items-center justify-center">
			<p class="select-none text-sm italic text-gray-400">Nothing here!</p>
		</div>
	{/if}
</section>
