<script lang="ts">
	import { Button, ImageUpload, Input, Textarea, Error, Success } from '@minemaker/ui';
	import type { PageProps } from './$types';
	import { updateGame } from '$lib/api-client';
	import { invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let name = $state(data.project.name);
	let description = $state(data.project.description);
	let thumbnail: File | undefined = $state();

	let error = $state('');
	let success = $state('');
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		// 5MB limit
		if (thumbnail && thumbnail.size > 5 * 1000 * 1000) {
			loading = false;
			error = 'Thumbnail must be smaller than 5MB';
			return;
		}

		loading = true;
		error = '';
		success = '';

		try {
			const res = await updateGame(
				data.project.id,
				{ name, description, thumbnail },
				{ cache: 'no-store' }
			);

			if (res.status != 200) {
				throw res.data;
			}

			await invalidateAll();

			name = data.project.name;
			description = data.project.description;
			thumbnail = undefined;

			loading = false;
			success = 'Changes saved';
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

<h1 class="text-3xl font-bold">Edit Project</h1>
<form class="w-full max-w-[800px] space-y-4" {onsubmit}>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}

	{#if success !== ''}
		<Success>{success}</Success>
	{/if}

	<ImageUpload class="w-[384px]" bind:img={thumbnail}>
		<img
			src={thumbnail != undefined
				? URL.createObjectURL(thumbnail)
				: `https://cdn.minemaker.net/images/${data.project.thumbnail}/thumbnail`}
			class="h-[256px] w-[384px]"
			alt="Project icon"
		/>
	</ImageUpload>

	<Input type="text" placeholder="My project" class="w-full" bind:value={name} maxlength={50}>
		Project name
	</Input>

	<Textarea placeholder="..." class="w-full" maxlength={1000} bind:value={description}>
		Description
	</Textarea>

	<Button type="submit" class="w-full justify-center text-center" {loading}>Save Changes</Button>
</form>
