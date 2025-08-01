<script lang="ts">
	import { Input, Link, LinkButton, NavLink } from '@minemaker/ui';
	import { type User } from '@minemaker/db';
	import { page } from '$app/state';
	import GemDisplay from './gemDisplay.svelte';

	import FluentTextAlignJustify20Filled from '~icons/fluent/text-align-justify-20-filled';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import FluentPaintBrush20Filled from '~icons/fluent/paint-brush-20-filled';
	import FluentSettings20Filled from '~icons/fluent/settings-20-filled';
	import FluentSearch20Filled from '~icons/fluent/search-20-filled';
	import FluentArrowExit20Filled from '~icons/fluent/arrow-exit-20-filled';
	import FluentChat20Filled from '~icons/fluent/chat-20-filled';
	import FluentPeople20Filled from '~icons/fluent/people-20-filled';
	import FluentBuildingShop20Filled from '~icons/fluent/building-shop-20-filled';

	let { user }: { user: User } = $props();

	let sideNavOpen = $state(false);
	let topNav: HTMLElement;

	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node) && sideNavOpen && event.target != topNav) {
				sideNavOpen = false;
			}
		};

		document.addEventListener('click', handleClick, true);

		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}
</script>

<nav
	class={`relative z-50 flex h-14 w-screen justify-end px-12 py-2 ${page.url.pathname.endsWith('/gems') || page.url.pathname.endsWith('/gems/') ? '' : 'bg-gray-700 shadow-lg'}`}
	bind:this={topNav}
>
	<a
		href="/"
		class="absolute left-12 flex transition-all hover:scale-105 focus:scale-105 active:scale-95"
	>
		<img src="/mmlogo.png" alt="Minemaker Logo" class="h-10" />
		<span class="text-mm-blue text-xs">beta</span>
	</a>

	<div class="pl-62 pointer-events-none flex h-10 w-full flex-1 items-center justify-center">
		<div class="pointer-events-auto flex h-full w-full items-center justify-center space-x-2">
			<Input
				class="h-full! w-64! bg-gray-800! border-gray-800 text-white outline-gray-800 hover:bg-gray-700"
				componentSize="sm"
				stretchHeight={true}
				placeholder="Search..."
			/>
			<LinkButton size="sm" color="darkgray" class="h-full!">
				<FluentSearch20Filled class="h-full" />
			</LinkButton>
		</div>
	</div>

	<div class="flex w-max items-center space-x-4">
		{#if user.player}
			{#if user.account}
				<a href="/gems">
					<GemDisplay size="lg">
						{new Intl.NumberFormat('en-US', {
							notation: 'compact',
							maximumFractionDigits: 1
						}).format(user.account.gems)}
					</GemDisplay>
				</a>
			{/if}
			<a href={`/profile/${user.player.username}`} class="flex h-10 items-center">
				<img
					src={`https://mc-heads.net/avatar/${user.player.uuid}`}
					alt="Player head"
					title={user.player.username}
					class="aspect-square size-8 select-none"
				/>
			</a>
		{:else if user.account}
			<a href={`/link`} class="flex h-10 items-center">
				<img
					src="https://mc-heads.net/avatar/MHF_Steve"
					alt="Player head"
					title={user.account.email}
					class="aspect-square size-8 select-none"
				/>
			</a>
			<LinkButton color="darkgray" size="md" href="/link">Link</LinkButton>
		{:else}
			<Link href="/login" class="no-underline! hover:underline! text-white">Login</Link>
			<LinkButton color="darkgray" size="md" href="/signup">Sign Up</LinkButton>
		{/if}
		{#if !sideNavOpen}
			<button
				class="cursor-pointer"
				onclick={() => {
					sideNavOpen = true;
				}}
			>
				<FluentTextAlignJustify20Filled class="mt-0.5 size-6" />
			</button>
		{:else}
			<button
				class="cursor-pointer"
				onclick={() => {
					sideNavOpen = false;
				}}
			>
				<FluentDismiss20Filled class="mt-0.5 size-6" />
			</button>
		{/if}
	</div>
</nav>

{#if sideNavOpen}
	<nav
		class="absolute right-0 z-40 flex h-full min-w-[300px] flex-col items-end bg-gray-700 pt-16 shadow-2xl"
		use:clickOutside
	>
		<NavLink href="/">
			<FluentHome20Filled class="h-6 w-6" />
			<span>Home</span>
		</NavLink>
		<NavLink href="/gems">
			<img src="/gem.png" alt="Gem icon" class="pointer-events-none aspect-auto h-6 select-none" />
			<span>Gem Shop</span>
		</NavLink>

		{#if user.player}
			<span class="mb-2 mt-4 w-full select-none px-2 text-left text-sm text-gray-400">CONNECT</span>
			<NavLink href="/friends">
				<FluentPeople20Filled class="h-6 w-6" />
				<span>Friends</span>
			</NavLink>
			<NavLink href="/messages">
				<FluentChat20Filled class="h-6 w-6" />
				<span>Messages</span>
			</NavLink>
		{/if}

		<span class="mb-2 mt-4 w-full select-none px-2 text-left text-sm text-gray-400">CREATE</span>
		<NavLink href="/studio/projects">
			<FluentPaintBrush20Filled class="h-6 w-6" />
			<span>Studio</span>
		</NavLink>
		<NavLink href="/marketplace">
			<FluentBuildingShop20Filled class="h-6 w-6" />
			<span>Marketplace</span>
		</NavLink>

		{#if user.account || user.player}
			<span class="mb-2 mt-4 w-full select-none px-2 text-left text-sm text-gray-400">ACCOUNT</span>
		{/if}
		{#if user.player}
			<NavLink href="/profile">
				<img
					src={`https://mc-heads.net/avatar/${user.player.uuid}`}
					alt="Player head"
					title={user.player.username}
					class="h-6"
				/>
				<span>Profile</span>
			</NavLink>
		{/if}
		{#if user.account}
			<NavLink href="/settings">
				<FluentSettings20Filled class="h-6 w-6" />
				<span>Settings</span>
			</NavLink>
		{/if}
		<div class="flex-1"></div>
		{#if user.account || user.player}
			<NavLink href="/logout">
				<FluentArrowExit20Filled class="h-6 w-6 text-red-400" />
				<span>Log Out</span>
			</NavLink>
		{/if}
	</nav>
{/if}
