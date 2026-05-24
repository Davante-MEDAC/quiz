<script lang="ts">
	let { current, total }: { current: number; total: number } = $props();

	const pct = $derived((current / total) * 100);
</script>

<div class="flex flex-1 items-center gap-3">
	<div class="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
		<div
			class="h-full rounded-full bg-orange-400 transition-all duration-300"
			style="width: {pct}%"
		></div>
	</div>
	<span class="min-w-[3rem] text-right text-sm font-semibold text-gray-500 dark:text-slate-400"
		>{current}/{total}</span
	>
</div>
