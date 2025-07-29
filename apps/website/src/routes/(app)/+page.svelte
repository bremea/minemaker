<script lang="ts">
	import LinkNotice from '$lib/components/linkNotice.svelte';
	import { getUser } from '$lib/state.svelte';

	let user = $derived(getUser());
</script>

{#if user.account && !user.player}
	<LinkNotice />
{/if}
