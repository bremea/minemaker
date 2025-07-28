<script lang="ts">
	import FluentChevronRight24Filled from '~icons/fluent/chevron-right-24-filled';
	import type { LinkButtonPropOptions, LinkButtonProps } from './linkButton.svelte';
	import LinkButton from './linkButton.svelte';

	let props: LinkButtonProps = $props();

	const textMarginClasses: { [K in LinkButtonPropOptions['size']]: string } = {
		sm: 'mr-4',
		md: 'mr-5',
		lg: 'mr-6',
		xl: 'mr-7'
	};

	const arrowMarginClasses: { [K in LinkButtonPropOptions['size']]: string } = {
		sm: 'right-4 group-hover:right-2',
		md: 'right-5 group-hover:right-3',
		lg: 'right-6 group-hover:right-4',
		xl: 'right-7 group-hover:right-5'
	};
</script>

<LinkButton {...props}>
	<span class={textMarginClasses[props.size ?? 'lg']}>{@render props.children?.()}</span>
	<FluentChevronRight24Filled
		class={`absolute transition-all ${arrowMarginClasses[props.size ?? 'lg']}`}
	/>
</LinkButton>
