<script lang="ts">
	import FluentChevronLeft24Filled from '~icons/fluent/chevron-left-24-filled';
	import type { ButtonProps } from './button.svelte';
	import Button from './button.svelte';

	let props: ButtonProps = $props();
</script>

<Button {...props}>
	<FluentChevronLeft24Filled
		class="absolute left-6 transition-all group-hover:left-4"
	/>
	<span class="ml-6">{@render props.children?.()}</span>
</Button>
