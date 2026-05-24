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
	class="w-full rounded-2xl bg-sky-500 py-4 text-center font-bold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
>
	{label}
</button>
