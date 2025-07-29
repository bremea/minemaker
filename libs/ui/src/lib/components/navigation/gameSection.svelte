<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { type Game } from '@minemaker/db';
	import { GameTile } from '.';

	export interface GameSectionProps extends HTMLAttributes<HTMLDivElement> {
		label: string;
		games: Game[];
	}

	let { games, label, class: className }: GameSectionProps = $props();
</script>

<section class={`space-y-4 ${className}`}>
	<h2 class="text-2xl font-bold">{label}</h2>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
		{#each games as game}
			<GameTile {game} />
		{/each}
	</div>
</section>
