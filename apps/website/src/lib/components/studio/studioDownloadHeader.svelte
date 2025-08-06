<script>
	import { Button, Link } from '@minemaker/ui';
	import UilWindows from '~icons/uil/windows';
</script>

<section
	class="flex w-full flex-col items-center justify-center space-y-8 rounded-lg bg-gray-700 px-12 py-8"
>
	<img src="/studiologo.png" alt="Minemaker Studio Logo" class="h-20" />
	<div class="flex flex-col items-center space-y-2">
		<p class="text-center">
			Download the free Minemaker Studio app to build and test your projects.
		</p>
		<Button color="purple"><UilWindows /> <span>Download</span></Button>
		<Link class="text-xs !text-gray-400 hover:text-gray-300!">Other downloads</Link>
	</div>
</section>
