<script lang="ts">
	import { LinkButton } from './index.js';
	import LogosMicrosoftIcon from '~icons/logos/microsoft-icon';
	import { type LinkButtonProps } from './linkButton.svelte';

	let {
		children,
		color = 'white',
		size = 'md',
		class: className,
		...others
	}: LinkButtonProps = $props();
</script>

<LinkButton class="w-full! flex items-end justify-center text-center" {size} {color} {...others}>
	<LogosMicrosoftIcon class="size-6" />
	<span class="font-bold">Login with Microsoft</span>
</LinkButton>
