<script lang="ts">
	import { Button, CopyCode, Loader } from '@minemaker/ui';
	import FluentChevronRight20Filled from '~icons/fluent/chevron-right-20-filled';
	import FluentArrowSync20Filled from '~icons/fluent/arrow-sync-20-filled';
	import { getRelativeTime, getTimeFromSnowflake } from '$lib/utils';
	import type { BuildOmitGameArtifacts } from '@minemaker/db';
	import { getBuilds } from '$lib/api-client.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let error = $state('');
	let loading = $state(true);
	let builds: BuildOmitGameArtifacts[] = $state([]);

	const fetchBuilds = async () => {
		loading = true;

		try {
			const res = await getBuilds(data.project.id);
			if (res.status != 200) {
				throw res.data;
			}

			loading = false;
			builds = res.data as BuildOmitGameArtifacts[];
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	};

	onMount(fetchBuilds);
</script>

<div class="flex flex-col space-y-4">
	<div class="flex items-end justify-between space-x-4">
		<h1 class="text-3xl font-bold">Builds</h1>
		<Button color="gray" size="sm" {loading} disabled={loading} onclick={() => fetchBuilds()}>
			<FluentArrowSync20Filled />
			<span>Refresh</span>
		</Button>
	</div>

	<div class="min-h-[557px] rounded-lg border-2 border-gray-900 bg-gray-900/50 p-4">
		<table class="w-full">
			<thead class="border-b-2 border-gray-600">
				<tr class="text-left">
					<th class="w-1/4 pb-4 pl-4">Build ID</th>
					<th class="w-1/4 pb-4">Description</th>
					<th class="w-1/8 pb-4">Author</th>
					<th class="w-1/8 pb-4">Created</th>
					<th class="w-1/8 pb-4"></th>
				</tr>
			</thead>
			<tbody>
				{#if loading}
					{#each Array(10) as _, i}
						<tr class="group relative h-12 border-b-2 border-gray-600/25">
							<td class="h-12">
								<div
									class="absolute left-0 top-2 h-8 w-full animate-pulse rounded bg-gray-700/50"
								></div>
							</td>
						</tr>
					{/each}
				{:else}
					{#each builds as build}
						<tr class="group h-12 border-b-2 border-gray-600/25 transition-all hover:bg-gray-700">
							<td class="flex h-12 items-center space-x-2 pl-4">
								{#if build.live}
									<span class="bg-mm-blue rounded-lg p-1 px-2 text-sm font-bold text-black">
										LIVE
									</span>
								{/if}
								<CopyCode value={build.id} canCopy />
							</td>
							<td>
								{#if build.description}
									{build.description}
								{:else}
									<span class="select-none text-gray-500">&mdash;</span>
								{/if}
							</td>
							<td>
								<div class="flex h-12 items-center space-x-2">
									<img
										src={`https://mc-heads.net/avatar/${build.author.uuid}`}
										alt="Player head"
										title={build.author.username}
										class="aspect-square size-6 select-none"
									/>
									<p>{build.author.username}</p>
								</div>
							</td>
							<td>{getRelativeTime(getTimeFromSnowflake(build.id))}</td>
							<td class="w-42 h-12">
								<a
									class="group/link w-42 flex h-12 items-center justify-end transition-all"
									href={`builds/${build.id}`}
								>
									<span class="group-hover/link:text-mm-blue text-nowrap italic text-gray-400">
										View details
									</span>
									<div class="relative mr-4 flex h-12 w-8 items-center justify-start">
										<FluentChevronRight20Filled
											class="group-hover:text-mm-blue absolute right-0 size-6 text-gray-400 transition-all group-hover/link:-right-2"
										/>
									</div>
								</a>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>
