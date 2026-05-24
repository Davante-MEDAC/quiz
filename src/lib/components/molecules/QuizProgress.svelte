<script lang="ts">
	import CloseButton from '../atoms/CloseButton.svelte';
	import ProgressBar from '../atoms/ProgressBar.svelte';

	let { backHref, current, total }: { backHref: string; current: number; total: number } = $props();
</script>

<div class="flex items-center gap-4 py-2">
	<CloseButton href={backHref} />
	<ProgressBar {current} {total} />
</div>
