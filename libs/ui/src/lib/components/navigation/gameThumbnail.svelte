<script lang="ts">
	import type { Game } from '@minemaker/db';
	import type { HTMLImgAttributes } from 'svelte/elements';

	export interface GameTileProps extends HTMLImgAttributes {
		class?: string;
		href?: string;
		alt?: string;
		game: Game;
	}

	let { game, class: className, alt = 'Game thumbnail', ...others }: GameTileProps = $props();
</script>

<img
	src={`https://cdn.minemaker.net/images/${game.thumbnail ?? 'e2300692-29ef-4ad4-c815-a759c59a8c00'}/thumbnail`}
	class={className}
	{alt}
	{...others}
/>
