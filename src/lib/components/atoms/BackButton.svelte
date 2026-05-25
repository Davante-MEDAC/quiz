<script lang="ts">
	import { resolve } from '$app/paths';

	let { href }: { href: string } = $props();
</script>

<a
	href={resolve(href)}
	class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-olive-200 bg-white text-olive-600 transition-colors hover:bg-olive-50"
>
	<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
		<path
			fill-rule="evenodd"
			d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
			clip-rule="evenodd"
		/>
	</svg>
</a>
