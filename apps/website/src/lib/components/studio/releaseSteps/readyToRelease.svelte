<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { releaseGame, type GetGameReleaseEligibility200 } from '$lib/api-client';
	import type { Game } from '@minemaker/db';
	import { Button, Error } from '@minemaker/ui';

	import FluentCheckboxChecked16Filled from '~icons/fluent/checkbox-checked-16-filled';

	let { game }: { game: Game & { eligibility: GetGameReleaseEligibility200 } } = $props();

	let loading = $state(false);
	let error = $state('');

	async function release(event: MouseEvent) {
		event.preventDefault();

		if (!game.eligibility.eligible) {
			return;
		}
		loading = true;

		try {
			const res = await releaseGame(game.id);

			if (res.status != 200) {
				throw res.data;
			}

			invalidateAll();
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	}
</script>

<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
	<div class="space-y-4 px-4">
		<h3 class="flex items-center space-x-2 text-xl font-bold">
			<FluentCheckboxChecked16Filled class="text-green-400" />
			<span>Your game is ready for release</span>
		</h3>
		<p class="text-sm">
			Congrats! You've completed the release checklist. Use the button below to publish your game to
			Minemaker.
		</p>
		{#if error !== ''}
			<Error>{error}</Error>
		{/if}
		<Button {loading} class="w-full! justify-center text-center" onclick={release}
			>Release Game</Button
		>
	</div>
</div>
