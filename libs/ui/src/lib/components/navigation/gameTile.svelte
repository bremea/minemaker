<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';
	import { type Game } from '@minemaker/db';

	export interface GameTileProps extends HTMLAnchorAttributes {
		class?: string;
		href?: string;
		game: Game;
	}

	let { game, href = `/game/${game.id}`, class: className, ...others }: GameTileProps = $props();
</script>

<a
	class="group basis-64 rounded-lg p-2 transition-all hover:bg-gray-700 active:scale-95 active:bg-gray-600"
	{href}
	{...others}
>
	<img
		src={`https://cdn.minemaker.net/images/${game.thumbnail}/thumbnail`}
		alt="icon"
		class="w-full rounded"
	/>
	<p class="mt-1 text-lg font-bold">{game.name}</p>
	<p class="mt-1 flex items-center space-x-1.5 text-xs text-gray-400">
		<FluentCircle20Filled class="size-2.5 text-green-400" />
		<span>
			<span class="text-white">{game.online}</span>
			{game.online == 1 ? 'player' : 'players'} online
		</span>
	</p>
</a>
