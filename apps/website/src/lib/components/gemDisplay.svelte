<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type GemDisplaySizeOptions = 'sm' | 'md' | 'lg' | 'xl';

	const sizeClasses: { [K in GemDisplaySizeOptions]: string } = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-xl',
		xl: 'text-3xl'
	};

	interface GemDisplayProps extends HTMLAttributes<HTMLDivElement> {
		size?: GemDisplaySizeOptions;
	}

	let { children, size = 'xl' }: GemDisplayProps = $props();
</script>

<div class="flex items-center space-x-1">
	<img src="/gem.png" alt="Gem icon" class="aspect-auto h-10 select-none" />
	<p class={`mb-1 ${sizeClasses[size]}`}>
		<span class="font-minecraft">{@render children?.()}</span>
	</p>
</div>
