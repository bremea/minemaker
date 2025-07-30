<script lang="ts">
	import { NavLink } from '@minemaker/ui';
	import type { Game } from '@minemaker/db';
	import { page } from '$app/state';

	import FluentGrid20Filled from '~icons/fluent/grid-20-filled';
	import FluentEdit20Filled from '~icons/fluent/edit-20-filled';
	import FluentDataHistogram20Filled from '~icons/fluent/data-histogram-20-filled';
	import FluentCart20Filled from '~icons/fluent/cart-20-filled';
	import FluentPersonLock20Filled from '~icons/fluent/person-lock-20-filled';
	import FluentKey20Filled from '~icons/fluent/key-20-filled';
	import FluentGavel20Filled from '~icons/fluent/gavel-20-filled';
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';
	import FluentEyeShow20Filled from '~icons/fluent/eye-show-20-filled';
	import FluentDatabase20Filled from '~icons/fluent/database-20-filled';
	import FluentWrenchSettings20Filled from '~icons/fluent/wrench-settings-20-filled';
	import FluentDocumentChevronDouble20Filled from '~icons/fluent/document-chevron-double-20-filled';
	import FluentOpen16Filled from '~icons/fluent/open-16-filled';

	let project = $derived(page.data.project as Promise<Game> | undefined);

	let { children, data } = $props();
</script>

<div class="relative flex h-full min-h-screen">
	<nav class="border-r-1 sticky top-0 h-full min-h-screen w-[300px] border-r-gray-600 shadow-lg">
		<div class="flex flex-col items-center space-y-2 pt-4">
			<NavLink href="/studio/projects">
				<FluentGrid20Filled class="h-6 w-6" />
				<span>Games</span>
			</NavLink>
			<NavLink href="https://docs.minemaker.net/" target="_blank">
				<FluentDocumentChevronDouble20Filled class="h-6 w-6" />
				<span class="flex items-center space-x-1">
					<span>Documentation</span>
					<FluentOpen16Filled class="size-4" />
				</span>
			</NavLink>
			{#if project}
				{#await project then project}
					<div class="mt-4 w-full p-2">
						<p class="text-xl font-bold">{project.name}</p>
					</div>
					<NavLink href={`/studio/projects/${project.id}`}>
						<FluentEyeShow20Filled class="h-6 w-6" />
						<span>Overview</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/edit`}>
						<FluentEdit20Filled class="h-6 w-6" />
						<span>Edit</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/builds`}>
						<FluentWrenchSettings20Filled class="h-6 w-6" />
						<span>Builds</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/analytics`}>
						<FluentDataHistogram20Filled class="h-6 w-6" />
						<span>Analytics</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/store`}>
						<FluentCart20Filled class="h-6 w-6" />
						<span>Store</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/db`}>
						<FluentDatabase20Filled class="h-6 w-6" />
						<span>K/V Database</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/access`}>
						<FluentPersonLock20Filled class="h-6 w-6" />
						<span>Access</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/secrets`}>
						<FluentKey20Filled class="h-6 w-6" />
						<span>Secrets</span>
					</NavLink>
					<NavLink href={`/studio/projects/${project.id}/moderation`}>
						<FluentGavel20Filled class="h-6 w-6" />
						<span>Moderation</span>
					</NavLink>
					<NavLink>
						<FluentOpen20Filled class="h-6 w-6" />
						<span>Open in Studio</span>
					</NavLink>
				{/await}
			{/if}
		</div>
	</nav>

	<main class="h-full w-full space-y-8 p-12">
		{@render children?.()}
	</main>
</div>
