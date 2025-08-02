<script lang="ts">
	import { login } from '$lib/api-client';
	import {
		Button,
		Input,
		Error,
		Password
	} from '@minemaker/ui';
	
	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);
	
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
		<h1 class="text-2xl">Login</h1>
	</div>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}
	<Input type="email" class="w-full" required bind:value={email}>Email Address</Input>
	<div class="flex w-full flex-col">
		<Password class="w-full" required bind:value={password}>Password</Password>
	</div>
	<div class="flex w-full flex-col space-y-2">
		<Button {loading} type="submit" class="w-full! justify-center">Login</Button>
	</div>
</form>
