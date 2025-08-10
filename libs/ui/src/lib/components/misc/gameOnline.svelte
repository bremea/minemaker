<script lang="ts">
	import FluentCircle20Filled from '~icons/fluent/circle-20-filled';

	type GameOnlineIndicatorSizeOptions = 'xs' | 'sm' | 'md';

	const sizeClasses: { [K in GameOnlineIndicatorSizeOptions]: string } = {
		xs: 'mt-1 space-x-1.5 text-xs flex items-center text-gray-400',
		sm: 'mt-1 flex items-center space-x-2 text-sm text-gray-400',
		md: 'space-x-3 text-sm' // TODO md size
	};

	const dotSizeClasses: { [K in GameOnlineIndicatorSizeOptions]: string } = {
		xs: 'size-2.5',
		sm: 'size-3 mr-1.5',
		md: 'size-3'
	};

	let { online = 0, size = 'xs' }: { online?: number; size?: GameOnlineIndicatorSizeOptions } =
		$props();
</script>

<p class={sizeClasses[size]}>
	<FluentCircle20Filled class={`${dotSizeClasses[size]} text-green-400`} />
	<span>
		<span class="text-white">{online}</span>
		{online == 1 ? 'player' : 'players'} online
	</span>
</p>
