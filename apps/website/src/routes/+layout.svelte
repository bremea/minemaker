<script lang="ts">
	import '../app.css';
	import { GlobalStyles } from '@minemaker/ui';

	let { children } = $props();
</script>

<svelte:head>
	<title>Minemaker</title>
</svelte:head>
<GlobalStyles />

{@render children()}
