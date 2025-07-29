<script lang="ts">
	import FluentErrorCircle20Filled from '~icons/fluent/error-circle-20-filled';
	import { Link, Loader } from '@minemaker/ui';
	import { onMount } from 'svelte';
	import { loginWithMicrosoft } from '$lib/api-client';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let error = $state('');

	onMount(async () => {
		try {
			const res = await loginWithMicrosoft({ code: data.code! });
			if (res.status != 200) {
				throw res.data;
			}

			window.location.href = '/';
		} catch (e: any) {
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	});
</script>

<div
	class="flex h-min min-h-[600px] w-[500px] flex-col items-center justify-center space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg"
>
	{#if error != ''}
		<div class="flex flex-col items-center justify-center space-y-4">
			<FluentErrorCircle20Filled class="size-12 text-gray-400" />
			<p class="text-center text-gray-400">
				{error}
			</p>
			<Link href="/login">Go back...</Link>
		</div>
	{:else}
		<Loader />
	{/if}
</div>
