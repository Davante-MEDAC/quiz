<script lang="ts">
	let { text }: { text: string } = $props();
</script>

<div class="rounded-2xl border border-olive-200 bg-olive-50 px-5 py-4">
	<p class="mb-1 text-xs font-semibold tracking-wide text-olive-600 uppercase">Explicación</p>
	<p class="text-sm text-olive-700">{text}</p>
</div>
