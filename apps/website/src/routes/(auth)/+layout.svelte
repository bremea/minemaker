<script lang="ts">
	let { children } = $props();
	import Footer from '$lib/components/footer.svelte';
</script>

<main class="min-h-screen w-full bg-[url(/cherrybg.png)] bg-cover bg-center bg-no-repeat">
	<div
		class="relative flex min-h-screen w-full flex-col items-center justify-center space-y-4 p-12 backdrop-blur-xs"
	>
		<a href="/" class="flex w-max transition-all hover:scale-105 focus:scale-105 active:scale-95">
			<img src="/mmlogo.png" alt="Minemaker Logo" class="h-12 drop-shadow-md" />
		</a>
		{@render children()}
	</div>
</main>
<Footer />
