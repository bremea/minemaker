<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { login } from '$lib/api-client';
	import { Button, Input, Error, Link, MicrosoftLoginButton, Password } from '@minemaker/ui';
	import { Turnstile } from 'svelte-turnstile';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let msLoading = $state(false);
	let waitingForTurnstile = $state(false);
	let turnstileToken: string | undefined = $state();

	const callback = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		waitingForTurnstile = false;
		turnstileToken = e.detail.token;
	};

	const waitForTurnstile = async () => {
		while (waitingForTurnstile) {
			await new Promise(async (re) => setTimeout(re, 100));
		}
		return;
	};

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (email.length == 0 || password.length == 0) {
			return;
		}
		loading = true;
		error = '';

		if (waitingForTurnstile) {
			await waitForTurnstile();
		}

		if (turnstileToken == undefined) {
			loading = false;
			error = 'CAPTCHA failed - try again';
			return;
		}

		try {
			const res = await login({
				email,
				password,
				turnstileToken
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

<form class="w-[500px] space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg" {onsubmit}>
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Welcome back!</h1>
	</div>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}
	<MicrosoftLoginButton href={data.authLink} />
	<hr class="text-gray-700" />
	<Input type="email" class="w-full" required bind:value={email}>Email Address</Input>
	<div class="flex w-full flex-col space-y-2">
		<Password class="w-full" required bind:value={password}>Password</Password>
		<p class="text-xs text-gray-400"><Link href="/resetpass">Forgot password?</Link></p>
	</div>
	<Turnstile
		siteKey={env.PUBLIC_CF_TURNSTILE_KEY}
		theme="dark"
		size="invisible"
		on:callback={callback}
	/>
	<div class="flex w-full flex-col space-y-2">
		<Button {loading} type="submit" class="w-full! justify-center">Login</Button>
		<p class="text-xs text-gray-400">
			Need an account? <Link href="/signup">Register</Link> instead.
		</p>
	</div>
</form>
