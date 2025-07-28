<script lang="ts">
	import { Button, Input, Error, Link } from '@minemaker/ui';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (password.length == 0) {
			return;
		}
		loading = true;

		try {
			//await login(PUBLIC_API_URL, email, password, true);

			window.location.href = '/';
		} catch (e: any) {
			loading = false;
			if (e.message) {
				error = e.message;
			} else {
				error = e.toString();
			}
		}
	}
</script>

<form class="w-[500px] space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg" {onsubmit}>
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Welcome back!</h1>
	</div>
	{#if error !== ''}
		<Error>{error}</Error>
	{/if}
	<Input type="email" class="w-full" required bind:value={email}>Email Address</Input>
	<div class="flex w-full flex-col space-y-2">
		<Input type="password" class="w-full" required bind:value={password}>Password</Input>
		<p class="text-xs text-gray-400"><Link href="/resetpass">Forgot password?</Link></p>
	</div>
	<div class="flex w-full flex-col space-y-2">
		<Button {loading} type="submit" class="w-full! justify-center">Login</Button>
		<p class="text-xs text-gray-400">
			Need an account? <Link href="/signup">Register</Link> instead.
		</p>
	</div>
</form>
