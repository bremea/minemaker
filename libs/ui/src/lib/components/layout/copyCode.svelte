<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentCopy20Filled from '~icons/fluent/copy-20-filled';
	import FluentCheckmark20Filled from '~icons/fluent/checkmark-20-filled';

	export interface CopyCodeProps extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		value?: string;
		canCopy?: boolean;
	}

	let check = $state(false);

	const showCheck = async () => {
		check = true;
		setTimeout(() => (check = false), 1000);
	};

	let { class: className, value = '', canCopy = false, ...others }: CopyCodeProps = $props();

	const copy = async () => {
		if (navigator?.clipboard?.writeText) {
			showCheck();
			await navigator.clipboard.writeText(value);
		}
	};
</script>

<div class="group flex w-full items-center space-x-2" {...others}>
	<code class={className ?? ''}>{value}</code>
	{#if canCopy}
		<button onclick={copy}>
			{#if check}
				<FluentCheckmark20Filled
					class="text-mm-blue opacity-0 transition-all group-hover:opacity-100"
				/>
			{:else}
				<FluentCopy20Filled
					class="hover:text-mm-blue-light active:text-mm-blue opacity-0 transition-all group-hover:opacity-50 hover:cursor-pointer hover:opacity-100 active:scale-90"
				/>
			{/if}
		</button>
	{/if}
</div>
