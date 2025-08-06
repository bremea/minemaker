<script lang="ts">
	import FluentErrorCircle20Filled from '~icons/fluent/error-circle-20-filled';
	import FluentContactCardLink20Regular from '~icons/fluent/contact-card-link-20-regular';
	import { Button, Link, Loader, Warning } from '@minemaker/ui';
	import { onMount } from 'svelte';
	import { confirmLink, linkOauth } from '$lib/api-client';
	import { type Player, type Account } from '@minemaker/db';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let player: Player | undefined = $state();
	let me: Account | undefined = $state();
	let loading = $state(true);
	let buttonLoading = $state(false);
	let error = $state('');

	onMount(async () => {
		try {
			const userData = await linkOauth({ code: data.code! });
			if (userData.status != 200) {
				throw userData.data;
			}

			player = userData.data.player as Player;
			me = userData.data.account as Account;

			loading = false;
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	});

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		loading = true;
		error = '';

		try {
			const res = await confirmLink({ code: data.code! });

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

<div
	class="flex h-min min-h-[600px] w-[500px] flex-col items-center justify-center space-y-4 rounded-lg bg-gray-800 p-8 shadow-lg"
>
	{#if loading}
		<Loader />
	{:else if error != ''}
		<div class="flex flex-col items-center justify-center space-y-4">
			<FluentErrorCircle20Filled class="size-12 text-gray-400" />
			<p class="text-center text-gray-400">
				{error}
			</p>
			<Link href="/link">Go back...</Link>
		</div>
	{:else if player && me}
		<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
			<h1 class="text-2xl">Link Accounts</h1>
			<p>
				You are about to link your Minecraft account
				<span class="font-bold">
					{player.username}
				</span> with your Minemaker account.
			</p>
		</div>
		<div class="flex w-full flex-col items-center">
			<div class="flex w-full flex-col overflow-hidden rounded-lg bg-gray-600">
				<div
					class="relative z-10 flex h-12 w-full items-center justify-center overflow-hidden bg-black/50"
				>
					<img src="/minecraft.svg" alt="Minecraft logo" class="z-20 h-8" />
					<div
						class="crisp-bg absolute top-0 left-0 z-0 h-full w-full bg-[url(/minecraftbg.png)] [background-size:72px] bg-center"
					></div>
				</div>
				<div class="m-4 mx-8 flex h-12 w-full space-x-4">
					<img
						src={`https://mc-heads.net/avatar/${player.uuid}`}
						alt="Player head"
						title={player.username}
						class="h-12"
					/>
					<div class="space-y-1">
						<p class="text-xl font-bold">{player.username}</p>
						<p class="text-xs opacity-50">{player.uuid}</p>
					</div>
				</div>
			</div>

			<FluentContactCardLink20Regular class="my-2 size-12 text-gray-600/50" />

			<div class="flex w-full flex-col overflow-hidden rounded-lg bg-gray-600">
				<div class="flex h-12 w-full items-center justify-center overflow-hidden bg-mm-blue">
					<img src="/mmlogo.png" alt="Minemaker logo" class="h-8" />
				</div>
				<div class="m-4 mx-8 flex h-12 w-full space-x-4">
					<img src="/favicon.png" alt="Minemaker logo" title={me.email} class="h-12" />
					<div class="space-y-1">
						<p class="text-xl font-bold">{me.email}</p>
						<p class="text-xs opacity-50">{me.id}</p>
					</div>
				</div>
			</div>
		</div>
		<form class="flex w-full flex-col space-y-2" {onsubmit}>
			<Button {loading} type="submit" class="w-full! justify-center">Link</Button>
			<p class="text-center text-xs text-gray-400">
				You can unlink your Minecraft account at any time in your account settings.
			</p>
		</form>
	{/if}
</div>
