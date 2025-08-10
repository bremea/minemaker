<script lang="ts">
	import { PlayerFlags } from '@minemaker/db/src/types/enums.js';
	import { Button, GameTile } from '@minemaker/ui';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';
	import FluentPersonAdd20Filled from '~icons/fluent/person-add-20-filled';

	let { data } = $props();
</script>

<svelte:head>
	<title>{data.profile.username} | Minemaker</title>
</svelte:head>

<main class="flex w-full flex-col items-center justify-center p-12">
	<div class="w-full rounded-lg bg-gray-600 px-8">
		<div class="relative flex h-32 w-full space-x-8">
			<div class="relative h-full w-32">
				<div class="h-42 absolute -top-10 flex w-36 justify-center overflow-hidden">
					<img
						src={`https://mc-heads.net/body/${data.profile.uuid}`}
						alt={`Skin for player ${data.profile.username}`}
						class="drop-shadow-black/75 pointer-events-none absolute w-full select-none p-4 drop-shadow-[0_0_8px_rgba(0,0,0,1)]"
					/>
				</div>
			</div>
			<div class="flex flex-col justify-center space-y-2">
				<h1 class="flex items-baseline space-x-2 text-4xl font-bold">
					<span>{data.profile.username}</span>
					{#if data.profile.flags != PlayerFlags.None}
						<div class="flex items-center space-x-2 rounded-lg bg-gray-800 px-2 py-1">
							{#if data.profile.flags & PlayerFlags.Staff}
								<div class="group relative">
									<img
										src="/staffbadge.png"
										alt="Minemaker Staff Badge"
										class="pointer-events-none size-6 select-none"
									/>
									<div
										class="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 select-none whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs opacity-0 transition-all group-hover:opacity-100"
									>
										Minemaker Staff
									</div>
								</div>
							{/if}

							{#if data.profile.flags & PlayerFlags.Partner}
								<div class="group relative">
									<img
										src="/partnerbadge.png"
										alt="Partner Badge"
										class="pointer-events-none size-6 select-none"
									/>
									<div
										class="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 select-none whitespace-nowrap rounded-lg bg-black px-2 py-1 text-xs opacity-0 transition-all group-hover:opacity-100"
									>
										Partner
									</div>
								</div>
							{/if}

							{#if data.profile.flags & PlayerFlags.Contributor}
								<div class="group relative">
									<img
										src="/contributorbadge.png"
										alt="Contributor Badge"
										class="pointer-events-none size-6 select-none"
									/>
									<div
										class="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 select-none whitespace-nowrap rounded-lg bg-gray-800 px-2 py-1 text-xs opacity-0 transition-all group-hover:opacity-100"
									>
										Contributor
									</div>
								</div>
							{/if}
						</div>
					{/if}
				</h1>
				<p class="mt-1 flex items-center space-x-1.5 text-gray-400">
					{#if data.profile.presence}
						<FluentCircle20Filled class="size-4 text-green-400" />
						<span>
							Playing
							<span class="font-bold text-white">{data.profile.presence.game.name}</span>
						</span>
					{:else}
						<FluentCircle20Filled class="size-4 text-gray-400" />
						<span>Offline</span>
					{/if}
				</p>
			</div>
			<div class="absolute right-0 flex h-full items-center">
				<Button color="darkgray" size="sm"
					><FluentPersonAdd20Filled /><span class="text-base">Add Friend</span></Button
				>
				<!-- 
				<div class="space-x-2 flex items-center text-gray-400"><FluentPersonClock20Filled /><span>Request Pending</span></div>
				<div class="space-x-2 flex items-center"><FluentPersonAvailable20Filled /><span>Friends</span></div>
				 -->
			</div>
		</div>
	</div>
	<div class="w-full bg-gray-800 p-8">
		{#if data.profile.creations}
			<section class="space-y-4">
				<h2 class="text-2xl font-bold">My Creations</h2>
				<div class="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-2">
					{#each data.profile.creations as game}
						<GameTile {game} />
					{/each}
				</div>
			</section>
		{/if}
	</div>
</main>
