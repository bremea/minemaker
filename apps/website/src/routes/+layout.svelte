<script lang="ts">
	import '../app.css';
	import { GlobalStyles } from '@minemaker/ui';
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>Minemaker</title>
</svelte:head>
<GlobalStyles />

<Navbar />
<div class="h-full grow">
	{@render children()}
</div>
<Footer />
