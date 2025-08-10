<script lang="ts">
	import { page } from '$app/state';
	import { Link } from '@minemaker/ui';
</script>

<svelte:head>
	<title>404 | Minemaker</title>
</svelte:head>

<main class="flex w-full flex-col items-center justify-center space-y-8 py-24">
	<h1 class="font-minecraft text-8xl">{page.status}</h1>
	{#if page.status == 404}
		<p>This page couldn't be found!</p>
	{/if}
	<p>Head back <Link href="/">home...</Link></p>
</main>
