<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Navbar from '$lib/components/nav.svelte';
	import { setUser } from '$lib/state.svelte.js';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	onMount(() => {
		setUser(data.user);
	});
</script>

<Navbar user={data.user} />
<div class="h-full grow">
	{@render children()}
</div>
<Footer />
