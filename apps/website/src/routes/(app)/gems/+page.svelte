<script>
	import GemDisplay from '$lib/components/gemDisplay.svelte';
	import { ArrowLinkRight } from '@minemaker/ui';
</script>

<svelte:head>
	<title>Gem Shop | Minemaker</title>
</svelte:head>

<div class="h-full min-h-screen w-full">
	<div class="-z-50 bg-[url(/starbg.png)] bg-cover bg-bottom bg-no-repeat absolute top-0 left-0 h-full w-full min-h-[110vh]"></div>
	<main class="flex flex-col items-center space-y-8 p-12">
		<div class="relative flex h-[150px] w-full items-center justify-center text-center">
			<img
				src="/gemshoplogo.png"
				alt="Gem Shop Logo"
				class="drop-shadow-green-900/25 crisp-bg pointer-events-none absolute z-0 aspect-auto w-[500px] select-none drop-shadow-lg"
			/>
			<div
				class="mask-[url(/gemshoplogo.png)] mask-center mask-contain mask-no-repeat absolute z-10 h-full w-[500px]"
			>
				<div class="shimmer h-full w-[500px] bg-white"></div>
			</div>
		</div>

		<div class="w-[500px] rounded-lg bg-gray-700/25 p-4 backdrop-blur-sm">
			<div class="mb-4 space-y-2 px-8 text-center">
				<h2 class="font-minecraft text-3xl">Purchase Gems</h2>
				<p>Gems are a virtual currency that can be used to buy special items in games.</p>
			</div>

			<div class="flex justify-between border-b-2 border-b-gray-700 px-4 py-4">
				<GemDisplay>180</GemDisplay>
				<ArrowLinkRight color="green" class="w-[30%]! justify-end text-left">$2.99</ArrowLinkRight>
			</div>
			<div class="flex justify-between border-b-2 border-b-gray-700 px-4 py-4">
				<GemDisplay>450</GemDisplay>
				<ArrowLinkRight color="green" class="w-[30%]! justify-end text-left">$5.99</ArrowLinkRight>
			</div>
			<div class="flex justify-between border-b-2 border-b-gray-700 px-4 py-4">
				<GemDisplay>900</GemDisplay>
				<ArrowLinkRight color="green" class="w-[30%]! justify-end text-left">$10.99</ArrowLinkRight>
			</div>
			<div class="flex justify-between border-b-2 border-b-gray-700 px-4 py-4">
				<GemDisplay>1800</GemDisplay>
				<ArrowLinkRight color="green" class="w-[30%]! justify-end text-left">$20.99</ArrowLinkRight>
			</div>
			<div class="flex justify-between px-4 py-4">
				<GemDisplay>4500</GemDisplay>
				<ArrowLinkRight color="green" class="w-[30%]! justify-end text-left">$50.99</ArrowLinkRight>
			</div>

			<p class="mt-4 text-center text-[0.6rem]/3 text-gray-400">
				When you buy Gems you receive only a limited, non-refundable, non-transferable, revocable
				license to use Gems, which has no value in real currency. By purchasing Gems, (1) you agree
				that you are over 18, and (2) you represent that you understand and agree to the Terms of
				Use and Privacy Policy. No refunds. See Terms of Use for other limitations.
			</p>
		</div>
	</main>
</div>
