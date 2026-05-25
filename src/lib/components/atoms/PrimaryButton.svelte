<script lang="ts">
	let {
		label,
		onclick,
		disabled = false
	}: { label: string; onclick?: () => void; disabled?: boolean } = $props();
</script>

<button
	{onclick}
	{disabled}
	class="w-full rounded-full bg-olive-950 py-3 text-center font-medium text-white transition-colors hover:bg-olive-800 disabled:cursor-not-allowed disabled:opacity-40"
>
	{label}
</button>
