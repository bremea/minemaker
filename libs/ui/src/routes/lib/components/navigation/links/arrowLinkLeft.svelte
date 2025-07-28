<script lang="ts">
	import FluentChevronLeft24Filled from '~icons/fluent/chevron-left-24-filled';
	import type { LinkButtonPropOptions, LinkButtonProps } from './linkButton.svelte';
	import LinkButton from './linkButton.svelte';

	let props: LinkButtonProps = $props();

	const textMarginClasses: { [K in LinkButtonPropOptions['size']]: string } = {
		sm: 'ml-4',
		md: 'ml-5',
		lg: 'ml-6',
		xl: 'ml-7'
	};

	const arrowMarginClasses: { [K in LinkButtonPropOptions['size']]: string } = {
		sm: 'left-4 group-hover:left-2',
		md: 'left-5 group-hover:left-3',
		lg: 'left-6 group-hover:left-4',
		xl: 'left-7 group-hover:left-5'
	};
</script>

<LinkButton {...props}>
	<FluentChevronLeft24Filled
		class={`absolute transition-all ${arrowMarginClasses[props.size ?? 'lg']}`}
	/>
	<span class={textMarginClasses[props.size ?? 'lg']}>{@render props.children?.()}</span>
</LinkButton>
