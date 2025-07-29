<script lang="ts">
	import FluentChevronLeft24Filled from '~icons/fluent/chevron-left-24-filled';
	import type { LinkButtonPropOptions, LinkButtonProps } from './linkButton.svelte';
	import { LinkButton } from '.';

	export interface ArrowLinkLeftProps extends LinkButtonProps {
		animate?: boolean;
	}

	let { animate = false, ...props }: ArrowLinkLeftProps = $props();

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
		class={`absolute mt-px transition-all ${arrowMarginClasses[props.size ?? 'lg']} ${animate ? 'motion-safe:animate-bounce-left group-hover:animate-none' : ''}`}
	/>
	<span class={textMarginClasses[props.size ?? 'lg']}>{@render props.children?.()}</span>
</LinkButton>
