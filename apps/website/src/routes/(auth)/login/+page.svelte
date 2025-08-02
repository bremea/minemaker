<script lang="ts">
	import { login } from '$lib/api-client';
	import {
		Button,
		Input,
		Error,
		Link,
		MicrosoftLoginButton,
		Password,
		DiscordLoginButton
	} from '@minemaker/ui';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let msLoading = $state(false);
	let dcLoading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (email.length == 0 || password.length == 0) {
			return;
		}
		loading = true;
		error = '';

		try {
			const res = await login({
				email,
				password
			});

			if (res.status != 200) {
				throw res.data;
			}

			window.location.href = '/';
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	}
</script>

<form class="w-[500px] space-y-4 rounded-lg bg-gray-800 p-8 shadow-lg" {onsubmit}>
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Welcome back!</h1>
	</div>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}
	<MicrosoftLoginButton
		href={data.authLink}
		onclick={() => (msLoading = true)}
		loading={msLoading}
	/>
	<DiscordLoginButton href={data.authLink} onclick={() => (dcLoading = true)} loading={dcLoading} />
	<hr class="text-gray-700" />
	<Input type="email" class="w-full" required bind:value={email}>Email Address</Input>
	<div class="flex w-full flex-col">
		<Password class="w-full" required bind:value={password}>Password</Password>
		<p class="text-xs text-gray-400"><Link href="/resetpass">Forgot password?</Link></p>
	</div>
	<div class="flex w-full flex-col space-y-2">
		<Button {loading} type="submit" class="w-full! justify-center">Login</Button>
		<p class="text-xs text-gray-400">
			Need an account? <Link href="/signup">Register</Link> instead.
		</p>
	</div>
</form>
