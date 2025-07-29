<script lang="ts">
	import { ArrowLinkRight } from '@minemaker/ui';
</script>

<div
	class="relative m-8 h-[250px] overflow-clip rounded-lg bg-gray-700 bg-[url(/cherrybg.png)] bg-cover bg-center bg-no-repeat"
>
	<div class="pointer-events-none absolute inset-0 z-0">
		<div
			class="h-full w-full backdrop-blur-md [mask-image:linear-gradient(to_right,black_25%,transparent_75%)]"
		></div>
	</div>

	<div class="absolute inset-0 z-10 bg-gradient-to-r from-gray-700 from-10% to-black/0 to-75%"></div>

	<div class="absolute z-10 h-full w-full p-8">
		<div class="flex h-full max-w-[30%] flex-col justify-center space-y-4">
			<h2 class="text-2xl font-bold">Finish Signing Up</h2>
			<p>Link your Minecraft account to start playing games & unlock all of Minemaker</p>
			<ArrowLinkRight animate class="font-bold" href="/link">Link Account</ArrowLinkRight>
		</div>
	</div>
</div>
