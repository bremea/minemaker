<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/nav.svelte';

	let { children } = $props();
</script>

<Navbar />
<div class="h-full grow">
	{@render children()}
</div>
<Footer />
