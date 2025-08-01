<script lang="ts">
	import BiDiscord from '~icons/bi/discord';
	import OauthButton, { type OAuthButtonProps } from './oauthButton.svelte';

	let { children, ...others }: OAuthButtonProps = $props();
</script>

<OauthButton color="discord" {...others}>
	<BiDiscord class="size-6" />
	<span class="font-bold">Login with Discord</span>
</OauthButton>
