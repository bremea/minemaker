<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FluentImageAdd24Filled from '~icons/fluent/image-add-24-filled';

	export interface ImageUploadProps extends HTMLInputAttributes {
		class?: string;
		files?: FileList;
	}

	function dropHandler(ev: DragEvent) {
		ev.preventDefault();

		if (ev.dataTransfer?.files) {
			files = ev.dataTransfer?.files;
		}
	}

	function dragOverHandler(ev: DragEvent) {
		ev.preventDefault();
	}

	let {
		children,
		class: className,
		id,
		files = $bindable(),
		...others
	}: ImageUploadProps = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={`group relative ${className}`}>
	{@render children?.()}
	<div
		class="absolute top-0 left-0 z-10 h-full w-full bg-black/75 opacity-0 transition-all group-hover:opacity-100"
		ondrop={dropHandler}
		ondragover={dragOverHandler}
	>
		<label for="file" class="flex h-full w-full cursor-pointer items-center justify-center">
			<FluentImageAdd24Filled class="size-16" />
		</label>
		<input id="file" type="file" accept="image/png,image/jpg" class="hidden" bind:files />
	</div>
</div>
