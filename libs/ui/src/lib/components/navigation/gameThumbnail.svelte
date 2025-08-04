<script lang="ts">
	import type { Game } from '@minemaker/db';
	import type { HTMLImgAttributes } from 'svelte/elements';

	export interface GameTileProps extends HTMLImgAttributes {
		class?: string;
		href?: string;
		alt?: string;
		game: Game | Omit<Game, 'owner'>;
	}

	let { game, class: className, alt = 'Game thumbnail', ...others }: GameTileProps = $props();
</script>

<img
	src={`https://cdn.minemaker.net/images/${game.thumbnail}/thumbnail`}
	class={className}
	{alt}
	{...others}
/>
