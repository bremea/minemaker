<script lang="ts">
	import { Loader } from '@minemaker/ui';
	import FluentErrorCircle20Filled from '~icons/fluent/error-circle-20-filled';

	let { data, children } = $props();
</script>

{#await data.project}
	<Loader />
{:then}
	{@render children?.()}
{:catch e}
	<div class="flex h-full min-h-[200px] w-full flex-col items-center justify-center space-y-2">
		<FluentErrorCircle20Filled class="size-12 text-gray-400" />
		<p class="text-center text-gray-400 italic">
			{#if e.message}
				{e.message}
			{:else}
				{e.toString()}
			{/if}
		</p>
	</div>
{/await}
