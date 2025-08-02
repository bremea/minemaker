<script lang="ts">
	import { GameThumbnail } from '@minemaker/ui';
	import type { PageProps } from './$types';

	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';
	import ReadyToRelease from '$lib/components/studio/releaseSteps/readyToRelease.svelte';
	import Released from '$lib/components/studio/releaseSteps/released.svelte';
	import Checklist from '$lib/components/studio/releaseSteps/checklist.svelte';

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

		<GameThumbnail game={data.project} class="max-w-[384px]" alt="Project icon" />
	</div>

	<div class="w-[400px] space-y-4">
		{#if data.project.discoverable}
			<Released />
		{/if}

		{#if !data.project.discoverable && data.project.eligibility.eligible}
			<ReadyToRelease game={data.project} />
		{/if}

		{#if !data.project.discoverable}
			<Checklist game={data.project} />
		{/if}
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
