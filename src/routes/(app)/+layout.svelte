<script lang="ts">
	import { resolve } from '$app/paths';

	import '../../app.css';

	let { children } = $props();
</script>

<div class="min-h-full text-olive-950">
	<nav class="border-navy-800 bg-navy-950 border-b">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<a href={resolve('/')} class="font-display text-base font-medium tracking-tight text-white">
					Quiz
				</a>
			</div>
		</div>
	</nav>

	<div class="py-10">
		{@render children?.()}
	</div>
</div>
