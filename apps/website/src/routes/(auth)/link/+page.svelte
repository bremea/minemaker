<script lang="ts">
	import { LinkButton, MicrosoftLoginButton } from '@minemaker/ui';
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<div class="w-[500px] space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
	<div class="mb-8 flex flex-col justify-center space-y-2 text-center">
		<h1 class="text-2xl">Unlock all of Minemaker</h1>
		<p>Login with your Minecraft account to link it to your Minemaker account.</p>
	</div>
	<MicrosoftLoginButton size="lg" href={data.authLink} />
</div>
