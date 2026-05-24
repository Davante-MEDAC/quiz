<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div class="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4">
	<p class="mb-1 text-xs font-semibold tracking-wide text-sky-500 uppercase">Explicación</p>
	<p class="text-sm text-gray-700">{text}</p>
</div>
