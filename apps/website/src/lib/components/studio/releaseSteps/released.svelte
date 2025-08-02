<script lang="ts">
	import { Button } from '@minemaker/ui';

	import FluentInfo16Filled from '~icons/fluent/info-16-filled';
</script>

<div class="h-min w-full overflow-clip rounded-lg bg-gray-700 py-4">
	<div class="space-y-4 px-4">
		<h3 class="flex items-center space-x-2 text-xl font-bold">
			<FluentInfo16Filled class="text-mm-blue" />
			<span>Your game is public</span>
		</h3>
		<p class="text-sm">
			Your game is currently available to play by all users on Minemaker. If you wish to set the
			game as private, use the button below.
		</p>
		<Button class="w-full! justify-center text-center" color="red">Set Private</Button>
	</div>
</div>
