<script lang="ts">
	import PrimaryButton from '../atoms/PrimaryButton.svelte';

	let { explanation, label, onclick }: { explanation: string; label: string; onclick: () => void } =
		$props();
</script>

<div
	class="fixed right-0 bottom-0 left-0 translate-y-0 rounded-t-3xl border-t border-gray-100 bg-white px-4 pt-5 pb-8 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] transition-transform duration-300"
>
	<p class="mb-1 text-xs font-semibold tracking-wide text-sky-500 uppercase">Explicación</p>
	<p class="mb-5 text-sm text-gray-700">{explanation}</p>
	<PrimaryButton {label} {onclick} />
</div>
