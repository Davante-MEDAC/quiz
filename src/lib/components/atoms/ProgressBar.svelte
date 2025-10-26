<script lang="ts">
	interface Props {
		current: number;
		total: number;
	}

	let { current, total }: Props = $props();

	let progress = $derived((current / total) * 100);
</script>

<div class="mb-5">
	<div class="bg-border mb-5 h-2 w-full overflow-hidden rounded">
		<div class="bg-primary h-full transition-[width] duration-300" style="width: {progress}%"></div>
	</div>
	<div class="mt-2 text-center text-sm font-semibold text-gray-400">
		{current} / {total}
	</div>
</div>
