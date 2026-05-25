<script lang="ts">
	import PrimaryButton from '../atoms/PrimaryButton.svelte';

	let { explanation, label, onclick }: { explanation: string; label: string; onclick: () => void } =
		$props();
</script>

<div
	class="fixed right-0 bottom-0 left-0 rounded-t-3xl border-t border-olive-100 bg-white px-4 pt-5 pb-8"
>
	<p class="mb-1 text-xs font-semibold tracking-wide text-olive-600 uppercase">Explicación</p>
	<p class="mb-5 text-sm text-olive-700">{explanation}</p>
	<PrimaryButton {label} {onclick} />
</div>
