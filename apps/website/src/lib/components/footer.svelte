<script lang="ts">
	import FluentOpen20Filled from '~icons/fluent/open-20-filled';

	let today = new Date();
</script>

<footer class="w-full space-y-8 bg-gray-900 p-12">
	<div class="flex w-full justify-between">
		<ul>
			<li>Studio</li>
			<li>
				<a class="text-gray-400 hover:underline" href="/studio/download">Download</a>
			</li>
			<li>
				<a
					class="flex items-center space-x-0.5 text-gray-400 hover:underline"
					href="https://docs.minemaker.net/"
					target="_blank"
				>
					<span>Documentation</span>
					<FluentOpen20Filled class="size-4" />
				</a>
			</li>
			<li>
				<a class="text-gray-400 hover:underline" href="/resources/privacy">Partner Program</a>
			</li>
		</ul>
		<ul>
			<li>Resources</li>
			<li><a class="text-gray-400 hover:underline" href="/support">Support</a></li>
			<li><a class="text-gray-400 hover:underline" href="/news">News</a></li>
		</ul>
		<ul>
			<li>Policies</li>
			<li>
				<a class="text-gray-400 hover:underline" href="/resources/guidelines">
					Community Guidelines
				</a>
			</li>
			<li><a class="text-gray-400 hover:underline" href="/resources/terms">Terms of Service</a></li>
			<li><a class="text-gray-400 hover:underline" href="/resources/privacy">Privacy Policy</a></li>
			<li><a class="text-gray-400 hover:underline" href="/resources/cookies">Cookies</a></li>
		</ul>
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
		<p class="text-center text-xs text-gray-500">
			Minemaker is not an official Minecraft website and is not associated with Mojang Studios or
			Microsoft. All product and company names are trademarks or registered trademarks of their
			respective holders. Use of these names does not imply any affiliation or endorsement by them.
		</p>
	</div>
</footer>
