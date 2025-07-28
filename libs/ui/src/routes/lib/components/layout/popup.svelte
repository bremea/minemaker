<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';

	export interface PopupProps extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		open?: boolean;
	}

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node) && open) {
				open = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	let { children, class: className, open = $bindable(false), ...others }: PopupProps = $props();
</script>

{#if open}
	<div
		class="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/50"
	>
		<div
			class={`relative min-w-[400px] max-w-[1000px] rounded-lg border-2 border-gray-600 bg-gray-800 p-8 shadow-lg space-y-2 ${className}`}
			use:clickOutside
			{...others}
		>
			<button
				class="group absolute top-2 right-2 flex cursor-pointer items-center justify-center rounded-lg p-2 transition-all hover:bg-gray-500 active:scale-95"
				onclick={() => open = false}
			>
				<FluentDismiss20Filled class="text-gray-400 transition-all group-hover:text-white" />
			</button>
			{@render children?.()}
		</div>
	</div>
{/if}
