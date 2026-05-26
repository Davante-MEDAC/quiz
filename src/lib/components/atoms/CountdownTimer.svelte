<script lang="ts">
	import { onMount } from 'svelte';

	let { seconds = 60, onExpire }: { seconds?: number; onExpire?: () => void } = $props();

	let remaining = $state(seconds);

	const radius = 22;
	const circumference = 2 * Math.PI * radius;
	const offset = $derived(circumference * (1 - remaining / seconds));
	const urgent = $derived(remaining <= 10 && remaining > 0);

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

<div class="timer relative flex h-14 w-14 items-center justify-center" class:urgent>
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
	<span
		class="relative text-sm font-semibold"
		class:text-olive-950={!urgent}
		class:text-red-600={urgent}>{remaining}</span
	>
</div>

<style>
	.timer {
		--timer-track: oklch(93% 0.007 106.5);
		--timer-progress: oklch(46.6% 0.025 107.3);
	}

	.timer.urgent {
		--timer-progress: oklch(57.7% 0.245 27.3);
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.12);
		}
	}
</style>
