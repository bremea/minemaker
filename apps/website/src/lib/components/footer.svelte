<script lang="ts">
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';

	import Fa6BrandsBluesky from '~icons/fa6-brands/bluesky';
	import Fa6BrandsDiscord from '~icons/fa6-brands/discord';
	import Fa6BrandsGithub from '~icons/fa6-brands/github';
	import Fa6BrandsTiktok from '~icons/fa6-brands/tiktok';
	import Fa6BrandsYoutube from '~icons/fa6-brands/youtube';
	let today = new Date();
</script>

<footer class="flex w-full flex-col items-center space-y-8 bg-gray-900 p-12">
	<div class="flex w-full justify-center space-x-12">
		<div class="w-[600px]">
			<div class="flex w-full flex-col items-center space-y-8">
				<div class="space-y-2">
					<img src="/mmlogo.png" alt="Minemaker Logo" class="w-[300px]" />
					<p class="text-center text-xs text-gray-500">Follow us!</p>
					<div class="flex w-full justify-center space-x-4">
						<Fa6BrandsGithub class="size-8 text-gray-400 transition-all hover:text-white" />
						<Fa6BrandsDiscord class="size-8 text-gray-400 transition-all hover:text-white" />
						<Fa6BrandsBluesky class="size-8 text-gray-400 transition-all hover:text-white" />
						<Fa6BrandsYoutube class="size-8 text-gray-400 transition-all hover:text-white" />
						<Fa6BrandsTiktok class="size-8 text-gray-400 transition-all hover:text-white" />
					</div>
				</div>
			</div>
		</div>
		<div class="flex max-w-[1000px] flex-1 justify-between">
			<ul>
				<li>Platform</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/about">About</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/parents">For Parents</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/credits">Contributors</a>
				</li>
				<li>
					<a
						class="flex items-center space-x-0.5 text-gray-400 hover:underline"
						href="https://jadecompany.games/jobs"
						target="_blank"
					>
						<span>Jobs</span>
						<FluentOpen20Filled class="size-4" />
					</a>
				</li>
			</ul>
			<ul>
				<li>Studio</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/studio">Overview</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/studio/download">Download</a>
				</li>
				<li>
					<a
						class="flex items-center space-x-0.5 text-gray-400 hover:underline"
						href="https://docs.minemaker.net/"
						target="_blank"
					>
						<span>Docs</span>
						<FluentOpen20Filled class="size-4" />
					</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/studio/partner">Partner Program</a>
				</li>
			</ul>
			<ul>
				<li>Resources</li>
				<li><a class="text-gray-400 hover:underline" href="/forums">Forums</a></li>
				<li><a class="text-gray-400 hover:underline" href="/support">Support</a></li>
				<li><a class="text-gray-400 hover:underline" href="/blog">Blog</a></li>
				<li>
					<a
						class="flex items-center space-x-0.5 text-gray-400 hover:underline"
						href="https://status.minemaker.net/"
						target="_blank"
					>
						<span>Status</span>
						<FluentOpen20Filled class="size-4" />
					</a>
				</li>
				<li>
					<a
						class="flex items-center space-x-0.5 text-gray-400 hover:underline"
						href="https://github.com/bremea/minemaker/blob/main/SECURITY.md"
						target="_blank"
					>
						<span>Security</span>
						<FluentOpen20Filled class="size-4" />
					</a>
				</li>
			</ul>
			<ul>
				<li>Policies</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/guidelines">
						Community Guidelines
					</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/terms">Terms of Service</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/privacy">Privacy Policy</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/cookies">Cookies</a>
				</li>
				<li>
					<a class="text-gray-400 hover:underline" href="/resources/dmca">DMCA</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="w-full space-y-1">
		<p class="text-center text-xs text-gray-500">
			&copy; {today.getFullYear()}
			<a
				href="https://jadecompany.games/"
				target="_blank"
				class="underline decoration-dotted hover:no-underline"
			>
				Jade & Company Games
			</a>. All Rights Reserved.
		</p>
		<p class="text-center text-[0.6rem] text-gray-500">
			Minemaker is not an official Minecraft website and is not associated with Mojang Studios or
			Microsoft. All product and company names are trademarks or registered trademarks of their
			respective holders. Use of these names does not imply any affiliation or endorsement by them.
		</p>
	</div>
</footer>
