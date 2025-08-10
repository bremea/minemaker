<script lang="ts">
	import { type Game } from '@minemaker/db';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { GameOnlineCount } from '../misc';
	import GameThumbnail from './gameThumbnail.svelte';

	export interface GameTileProps extends HTMLAnchorAttributes {
		class?: string;
		href?: string;
		game: Game | Omit<Game, 'owner'>;
	}

	let { game, href = `/game/${game.id}`, class: className, ...others }: GameTileProps = $props();
</script>

<a
	class="group basis-64 rounded-lg p-2 transition-all hover:bg-gray-700 active:scale-95 active:bg-gray-600"
	{href}
	{...others}
>
	<GameThumbnail {game} class="w-full rounded" />
	<p class="mt-1 text-lg font-bold">{game.name}</p>
	<GameOnlineCount online={game.online} />
</a>
