<script lang="ts">
	import { getMyGames } from '$lib/api-client';
	import NewGamePopup from '$lib/components/popups/newGamePopup.svelte';
	import StudioDownloadHeader from '$lib/components/studio/studioDownloadHeader.svelte';
	import type { Game } from '@minemaker/db';
	import { Button, GameSection } from '@minemaker/ui';
	import { onMount } from 'svelte';

	import FluentAdd12Filled from '~icons/fluent/add-12-filled';

	let games: Game[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	let newGamePopup = $state(false);

	const updateGames = async (limit?: number, start?: number) => {
		loading = true;

		try {
			const res = await getMyGames({ limit, start });
			if (res.status != 200) {
				throw res.data;
			}

			games = res.data as Game[];
			loading = false;
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	};

	onMount(updateGames);
</script>

<svelte:head>
	<title>Your Projects | Minemaker</title>
</svelte:head>

<StudioDownloadHeader />

<GameSection {games} {loading} {error} hrefPrefix="/studio/projects">
	<div class="flex items-center justify-between">
		<h2 class="text-2xl font-bold">Your Games</h2>
		<Button size="sm" onclick={() => (newGamePopup = true)}>
			<FluentAdd12Filled />
			<span>New Game</span>
		</Button>
	</div>
</GameSection>

<NewGamePopup bind:open={newGamePopup} />
