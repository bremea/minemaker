<script lang="ts">
	import { Link } from '@minemaker/ui';
	import { page } from '$app/state';
</script>

<main class="flex w-full flex-col items-center justify-center space-y-8 py-24">
	<h1 class="font-minecraft text-8xl">{page.status}</h1>
	{#if page.status == 404}
		<p>This page couldn't be found!</p>
	{/if}
	<p>Head back <Link href="/">home...</Link></p>
</main>
