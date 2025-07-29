<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => (window.location.href = '/'));
</script>

<div class="w-[500px] space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Logging out...</h1>
	</div>
</div>
