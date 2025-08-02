<script lang="ts">
	let { children } = $props();
	import { getVersion, getName } from '@tauri-apps/api/app';
	import { onMount } from 'svelte';

	let version = $state('');

	onMount(async () => {
		version = `${await getName()} v${await getVersion()}`
	})
</script>

<main class="min-h-screen w-full bg-[url(/cherrybg.png)] bg-cover bg-center bg-no-repeat">
	<div
		class="backdrop-blur-xs relative flex min-h-screen w-full flex-col items-center justify-center space-y-4 p-12"
	>
		<img
			src="/studiologo.png"
			alt="Minemaker Studio Logo"
			class="h-24 drop-shadow-md select-none pointer-events-none"
		/>
		{@render children()}
		<p class="absolute bottom-2 text-sm">{version}</p>
	</div>
</main>
