<script lang="ts">
	import { Input, Link, LinkButton, NavLink } from '@minemaker/ui';

	import FluentTextAlignJustify20Filled from '~icons/fluent/text-align-justify-20-filled';
	import FluentDismiss20Filled from '~icons/fluent/dismiss-20-filled';
	import FluentHome20Filled from '~icons/fluent/home-20-filled';
	import FluentPaintBrush20Filled from '~icons/fluent/paint-brush-20-filled';
	import FluentSearch20Filled from '~icons/fluent/search-20-filled';

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
	class="relative z-50 flex h-14 w-screen justify-end bg-gray-600 px-12 py-2 shadow-lg"
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
		<Link href="/login" class="no-underline! text-white hover:underline!">Login</Link>
		<LinkButton color="darkgray" size="md" href="/signup">Sign Up</LinkButton>
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
		class="absolute right-0 z-40 flex h-full w-64 flex-col items-end space-y-2 bg-gray-700 pt-16 shadow-2xl"
		use:clickOutside
	>
		<NavLink href="/">
			<FluentHome20Filled class="h-6 w-6" />
			<span>Home</span>
		</NavLink>
		<NavLink href="/studio/projects">
			<FluentPaintBrush20Filled class="h-6 w-6" />
			<span>Studio</span>
		</NavLink>
	</nav>
{/if}
