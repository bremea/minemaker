<script lang="ts">
	import LinkNotice from '$lib/components/linkNotice.svelte';
	import { getUser } from '$lib/state.svelte';
	import { GameSection } from '@minemaker/ui';
	import type { PageProps } from './$types';

	let user = $derived(getUser());
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Minemaker</title>
</svelte:head>

{#if user.account && !user.player}
	<LinkNotice />
{/if}

<main class="w-full p-12">
	{#if data.playlog.length > 0}
		<GameSection games={data.playlog} label="Recently Played" />
	{/if}
	<GameSection games={data.featured} label="Featured" />
</main>
