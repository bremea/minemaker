<script lang="ts">
	import { Button, GameOnlineCount, GameThumbnail } from '@minemaker/ui';
	import FluentPlay20Filled from '~icons/fluent/play-20-filled';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.game.name} | Minemaker</title>
</svelte:head>

<main class="flex h-full w-full flex-col items-center justify-center p-12">
	<div class="flex h-full space-x-4">
		<GameThumbnail game={data.game} class="w-[700px] rounded-lg" alt="Project icon" />
		<div class="flex w-[350px] flex-col justify-between overflow-hidden rounded-lg bg-gray-700 p-4">
			<div class="space-y-2">
				<h1 class="text-3xl font-bold">{data.game.name}</h1>
				<p class="flex items-center space-x-1 text-sm">
					<img
						src={`https://mc-heads.net/avatar/${data.game.owner.uuid}`}
						alt="Player head"
						title={data.game.owner.username}
						class="aspect-square size-4 select-none"
					/>
					<span class="text-gray-400">
						by <a
							class="text-white no-underline hover:underline"
							href={`/profile/${data.game.owner.username}`}
						>
							{data.game.owner.username}
						</a>
					</span>
				</p>
				<GameOnlineCount online={data.game.online} size="sm" />
			</div>
			<Button size="xl" class="w-full! justify-center">
				<FluentPlay20Filled />
			</Button>
		</div>
	</div>
</main>
