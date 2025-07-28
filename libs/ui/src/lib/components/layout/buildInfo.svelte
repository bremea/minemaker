<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import CopyCode from './copyCode.svelte';

	export interface BuildInfoProps extends HTMLAttributes<HTMLDivElement> {
		class?: string;
		label?: string;
		value?: string;
		canCopy?: boolean;
	}

	let {
		class: className,
		label = '',
		value = '',
		canCopy = false,
		...others
	}: BuildInfoProps = $props();
</script>

<div class="flex space-x-8" {...others}>
	<span class="min-w-24 text-gray-400 italic">{label}:</span>
	<CopyCode {value} {canCopy} />
</div>
