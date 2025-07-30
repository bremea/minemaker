<script lang="ts">
	import { Button, Link } from '@minemaker/ui';
	import type { PageProps } from './$types';

	import FluentCheckboxChecked16Filled from '~icons/fluent/checkbox-checked-16-filled';
	import FluentCheckboxUnchecked16Filled from '~icons/fluent/checkbox-unchecked-16-filled';
	import FluentLockClosed12Filled from '~icons/fluent/lock-closed-12-filled';
	import FluentInfo16Filled from '~icons/fluent/info-16-filled';
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';

	let { data }: PageProps = $props();
</script>

<div class="flex justify-between">
	<div class="space-y-2">
		<div>
			<h1 class="text-3xl font-bold">{data.project.name}</h1>
		</div>

		<p class="mt-1 flex items-center space-x-1.5 text-xs text-gray-400">
			<FluentCircle20Filled class="size-2.5 text-green-400" />
			<span>
				<span class="text-white">{data.project.online}</span>
				{data.project.online == 1 ? 'player' : 'players'} online
			</span>
		</p>

		<img
			src={`https://cdn.minemaker.net/images/${data.project.thumbnail}/thumbnail`}
			class="max-w-[384px]"
			alt="Project icon"
		/>
	</div>

	<div class="w-[400px] space-y-4">
		<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
			<div class="space-y-4 px-4">
				<h3 class="flex items-center space-x-2 text-xl font-bold">
					<FluentInfo16Filled class="text-mm-blue" />
					<span>Your game is public</span>
				</h3>
				<p class="text-sm">
					Your game is currently available to play by all users on Minemaker. If you wish to set the
					game as private, use the button below.
				</p>
				<Button class="w-full! justify-center text-center" color="red">Set Private</Button>
			</div>
		</div>

		<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
			<div class="space-y-4 px-4">
				<h3 class="flex items-center space-x-2 text-xl font-bold">
					<FluentCheckboxChecked16Filled class="text-green-400" />
					<span>Your game is ready for release</span>
				</h3>
				<p class="text-sm">
					Congrats! You've completed the release checklist. Use the button below to publish your
					game to Minemaker.
				</p>
				<Button class="w-full! justify-center text-center">Release Game</Button>
			</div>
		</div>

		<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
			<div class="space-y-4 px-4 pb-4">
				<h3 class="text-xl font-bold">Game Release Checklist</h3>
				<p class="text-sm">
					Before others can play your game on Minemaker, you'll need to complete all items on this
					checklist.
				</p>
			</div>
			<ul>
				{#if data.project.thumbnail && data.project.thumbnail != 'e2300692-29ef-4ad4-c815-a759c59a8c00'}
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
							<Link href={`/studio/projects/${data.project.id}/edit`}>Upload a thumbnail</Link>
						</p>
					</li>
				{/if}
				<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
					<div class="flex h-10 w-10 items-center justify-center">
						<FluentCheckboxUnchecked16Filled class="size-6 text-white" />
					</div>
					<p>
						<Link href={`/studio/projects/${data.project.id}/builds`}>Upload a build</Link>
					</p>
				</li>
				<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 px-2">
					<div class="flex h-10 w-10 items-center justify-center">
						<FluentLockClosed12Filled class="size-6 text-gray-400" />
					</div>
					<p class="text-gray-400">Release game</p>
				</li>
			</ul>
		</div>
	</div>
</div>
<!--
	<li class="flex items-center space-x-4 border-y-[1px] border-gray-700 bg-gray-800/50 px-2">
		<div class="flex h-10 w-10 items-center justify-center">
			<FluentClock12Filled class="size-6 text-gray-400" />
		</div>
		<p class="italic text-gray-400">Waiting for review...</p>
	</li>
-->
