<script lang="ts">
	import { Button, ImageUpload, Input, Textarea } from '@minemaker/ui';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let name = $state(data.project.name);
	let description = $state(data.project.description);
	let discoverable = $state(data.project.discoverable);
	let image: FileList | undefined = $state();
</script>

<h1 class="text-3xl font-bold">Edit Project</h1>
<form class="w-full max-w-[800px] space-y-4" {onsubmit}>
	<ImageUpload class="w-[384px]" bind:files={image}>
		<img
			src={image
				? URL.createObjectURL(image[0])
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

	<Button type="submit" class="w-full justify-center text-center">Save Changes</Button>
</form>
