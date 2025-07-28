<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { Button, Input, Error, Link, DOB, Password } from '@minemaker/ui';
	import { Turnstile } from 'svelte-turnstile';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	let allOk = $state(false);

	const pattern = /^(?=(?:.*\d){2,})(?=.*[^\w\s])(?=.*[a-z])(?=.*[A-Z]).{8,255}$/;

	const passwordRules = [
		{ label: 'Minimum 8 characters', pattern: /^.{8,200}$/ },
		{ label: 'Lowercase and uppercase letters', pattern: /^(?=.*[a-z])(?=.*[A-Z])/ },
		{ label: 'Minimum 2 digits', pattern: /(?=(?:.*\d){2,})/ },
		{ label: '1 or more symbols', pattern: /(?=.*[^\w\s])/ }
	];

	const callback = (e: CustomEvent<{ token: string; preClearanceObtained: boolean }>) => {
		console.log(e.detail);
	};

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!allOk) {
			return;
		}
		loading = true;

		try {
			//await login(PUBLIC_API_URL, email, password, true);

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

	$effect(() => {
		allOk = password.length > 0 && pattern.test(password) && email.length > 0;
	});
</script>

<form class="w-[500px] space-y-4 rounded-lg bg-gray-800 p-8 shadow-lg" {onsubmit}>
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Create an Account</h1>
	</div>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}
	<Input type="email" class="w-full" required bind:value={email}>Email Address</Input>
	<Password class="w-full" required bind:value={password} regex={pattern} rules={passwordRules}
		>Password</Password
	>
	<DOB required>Birthday</DOB>
	<Turnstile
		siteKey={env.PUBLIC_CF_TURNSTILE_KEY}
		theme="dark"
		size="invisible"
		on:callback={callback}
	/>
	<p class="text-xs text-gray-400">
		By clicking "Create Account", you agree to Minemaker's <Link
			href="/policies/terms"
			target="_blank">Terms of Service</Link
		>, <Link href="/policies/guidelines" target="_blank">Community Guidelines</Link>, and
		acknowledge the <Link href="/policies/privacy" target="_blank">Privacy Policy</Link>.
	</p>
	<div class="flex w-full">
		<Button {loading} type="submit" class="w-full! justify-center" disabled={!allOk}
			>Create Account</Button
		>
	</div>
</form>
