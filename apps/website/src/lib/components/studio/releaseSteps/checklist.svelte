<script lang="ts">
	import { type GetGameReleaseEligibility200 } from '$lib/api-client';
	import type { Game } from '@minemaker/db';
	import { Link } from '@minemaker/ui';

	import FluentCheckboxChecked16Filled from '~icons/fluent/checkbox-checked-16-filled';
	import FluentCheckboxUnchecked16Filled from '~icons/fluent/checkbox-unchecked-16-filled';
	import FluentLockClosed12Filled from '~icons/fluent/lock-closed-12-filled';

	let { game }: { game: Game & { eligibility: GetGameReleaseEligibility200 } } = $props();
</script>

<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
	<div class="space-y-4 px-4 pb-4">
		<h3 class="text-xl font-bold">Game Release Checklist</h3>
		<p class="text-sm">
			Before others can play your game on Minemaker, you'll need to complete all items on this
			checklist.
		</p>
	</div>
	<ul>
		{#if game.eligibility.requirements.thumbnailUploaded}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 bg-green-900 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentCheckboxChecked16Filled class="size-6 text-green-400" />
				</div>
				<p>Thumbnail uploaded</p>
			</li>
		{:else}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentCheckboxUnchecked16Filled class="size-6 text-white" />
				</div>
				<p>
					<Link href={`/studio/projects/${game.id}/edit`}>Upload a thumbnail</Link>
				</p>
			</li>
		{/if}

		{#if game.eligibility.requirements.liveBuild}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 bg-green-900 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentCheckboxChecked16Filled class="size-6 text-green-400" />
				</div>
				<p>Build Uploaded</p>
			</li>
		{:else}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentCheckboxUnchecked16Filled class="size-6 text-white" />
				</div>
				<p>
					<Link href={`/studio/projects/${game.id}/builds`}>Upload a build</Link>
				</p>
			</li>
		{/if}

		{#if !game.eligibility.eligible}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentLockClosed12Filled class="size-6 text-gray-400" />
				</div>
				<p class="text-gray-400">Release game</p>
			</li>
		{:else}
			<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
				<div class="flex h-10 w-10 items-center justify-center">
					<FluentCheckboxUnchecked16Filled class="size-6 text-white" />
				</div>
				<p>Release Game</p>
			</li>
		{/if}
	</ul>
</div>
