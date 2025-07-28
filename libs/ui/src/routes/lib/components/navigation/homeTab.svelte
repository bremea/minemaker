<script lang="ts">
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import { Tab } from './index.js';

	export interface HomeTabProps {
		index: number;
	}

	let { index }: HomeTabProps = $props();
</script>

<Tab href="/" closeable={false} {index}>
	<FluentHome20Filled class="size-6 h-6 w-6 text-white" />
</Tab>
