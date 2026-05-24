<script lang="ts">
	import CountdownTimer from '../atoms/CountdownTimer.svelte';

	let {
		question,
		onExpire
	}: { question: string; onExpire?: () => void } = $props();
</script>

<div class="relative mt-8 mb-6">
	<div class="absolute -top-7 left-1/2 z-10 -translate-x-1/2">
		<CountdownTimer seconds={30} {onExpire} />
	</div>
	<div class="rounded-3xl bg-sky-100 px-6 pb-6 pt-10">
		<p class="text-lg font-bold text-gray-900">{question}</p>
	</div>
</div>
