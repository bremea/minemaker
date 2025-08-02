<script lang="ts">
	let { children } = $props();
</script>

<main class="min-h-screen w-full bg-[url(/cherrybg.png)] bg-cover bg-center bg-no-repeat">
	<div
		class="backdrop-blur-xs relative flex min-h-screen w-full flex-col items-center justify-center space-y-4 p-12"
	>
		<a href="/" class="flex w-max transition-all hover:scale-105 focus:scale-105 active:scale-95">
			<img src="/studiologo.png" alt="Minemaker Studio Logo" class="h-24 drop-shadow-md" />
		</a>
		{@render children()}
	</div>
</main>
