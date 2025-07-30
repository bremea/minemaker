<script lang="ts">
	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { createGame } from '$lib/api-client';
	import { Button, Input, Error, Popup } from '@minemaker/ui';
	import { Turnstile } from 'svelte-turnstile';

	let loading = $state(false);
	let error = $state('');
	let name = $state('');
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

		if (name.length == 0 || name.length > 255) {
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
			const res = await createGame({ name, turnstileToken });
			if (res.status != 200) {
				throw res.data;
			}

			goto(`/studio/projects/${res.data.id}`);
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	}

	let { open = $bindable(false) } = $props();
</script>

<Popup bind:open class="w-[600px]">
	<form class="w-full space-y-8" {onsubmit}>
		<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
			<h1 class="text-2xl">Create a Game</h1>
		</div>
		{#if error !== ''}
			<Error>{error}</Error>
		{/if}
		<Input type="name" class="w-full" maxlength={255} required bind:value={name}>Name</Input>
		<Turnstile
			siteKey={env.PUBLIC_CF_TURNSTILE_KEY}
			theme="dark"
			size="invisible"
			on:callback={callback}
		/>
		<div class="flex w-full flex-col space-y-2">
			<Button {loading} type="submit" class="w-full! justify-center">Create</Button>
		</div>
	</form>
</Popup>
