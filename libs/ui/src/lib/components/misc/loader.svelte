<script lang="ts">
	import SvgSpinnersBlocksShuffle3 from '~icons/svg-spinners/blocks-shuffle-3';

	type LoaderSizeOptions = 'sm' | 'md' | 'lg' | 'xl';
	const sizeClasses: { [K in LoaderSizeOptions]: string } = {
		sm: 'size-6',
		md: 'size-8',
		lg: 'size-12',
		xl: 'size-16'
	};

	let { size = 'lg' }: { size?: LoaderSizeOptions } = $props();
</script>

<div class="flex h-full items-center justify-center py-24">
	<SvgSpinnersBlocksShuffle3 class={`${sizeClasses[size]} opacity-70`} />
</div>
