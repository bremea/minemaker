<script lang="ts">
	import FluentChevronRight24Filled from '~icons/fluent/chevron-right-24-filled';
	import type { ButtonProps } from './button.svelte';
	import Button from './button.svelte';

	let props: ButtonProps = $props();
</script>

<Button {...props}>
	<span class="mr-6">{@render props.children?.()}</span>
	<FluentChevronRight24Filled
		class="absolute right-6 transition-all group-hover:right-4"
	/>
</Button>
