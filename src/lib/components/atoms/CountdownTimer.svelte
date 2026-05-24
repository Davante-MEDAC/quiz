<script lang="ts">
	import { onMount } from 'svelte';

	let { seconds = 30, onExpire }: { seconds?: number; onExpire?: () => void } = $props();

	let remaining = $state(seconds);

	const radius = 22;
	const circumference = 2 * Math.PI * radius;
	const offset = $derived(circumference * (1 - remaining / seconds));

	onMount(() => {
		const id = setInterval(() => {
			remaining -= 1;
			if (remaining <= 0) {
				remaining = 0;
				clearInterval(id);
				onExpire?.();
			}
		}, 1000);
		return () => clearInterval(id);
	});
</script>

<div class="timer relative flex h-14 w-14 items-center justify-center">
	<svg class="absolute -rotate-90" width="56" height="56">
		<circle cx="28" cy="28" r={radius} fill="none" stroke="var(--timer-track)" stroke-width="3" />
		<circle
			cx="28"
			cy="28"
			r={radius}
			fill="none"
			stroke="var(--timer-progress)"
			stroke-width="3"
			stroke-linecap="round"
			stroke-dasharray={circumference}
			stroke-dashoffset={offset}
			class="transition-all duration-1000"
		/>
	</svg>
	<span class="relative text-sm font-bold text-gray-700 dark:text-white">{remaining}</span>
</div>

<style>
	.timer {
		--timer-track: #e5e7eb;
		--timer-progress: #38bdf8;
	}
	@media (prefers-color-scheme: dark) {
		.timer {
			--timer-track: #475569;
			--timer-progress: #38bdf8;
		}
	}
</style>
