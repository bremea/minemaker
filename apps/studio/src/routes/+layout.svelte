<script lang="ts">
	import '../app.css';
	import { GlobalStyles } from '@minemaker/ui';

	let { children } = $props();
</script>

<svelte:head>
	<title>Minemaker Studio</title>
</svelte:head>
<GlobalStyles />

{@render children()}
