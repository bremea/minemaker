<script lang="ts">
	import LogosMicrosoftIcon from '~icons/logos/microsoft-icon';
	import OauthButton, { type OAuthButtonProps } from './oauthButton.svelte';

	let { children, ...others }: OAuthButtonProps = $props();
</script>

<OauthButton color="white" {...others}>
	<LogosMicrosoftIcon class="size-6" />
	<span class="font-bold">Login with Microsoft</span>
</OauthButton>
