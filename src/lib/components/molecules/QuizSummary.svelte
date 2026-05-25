<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import PrimaryButton from '../atoms/PrimaryButton.svelte';

	let {
		correct,
		erroneous,
		total,
		backHref,
		onRetry = undefined,
		onComplete = undefined
	}: {
		correct: number;
		erroneous: number;
		total: number;
		backHref: string;
		onRetry?: () => void;
		onComplete?: (score: number) => void;
	} = $props();

	function tFactor(n: number): number {
		if (n >= 30) return 3;
		if (n >= 20) return 4;
		return 6;
	}

	const score = Math.max(0, ((correct - erroneous / tFactor(total)) / total) * 10);
	const passed = score >= 5;

	type Piece = {
		id: number;
		x: number;
		color: string;
		delay: number;
		duration: number;
		width: number;
		height: number;
		rotation: number;
	};

	let pieces = $state<Piece[]>([]);

	const COLORS = ['#6b7c3a', '#8fa04d', '#c5b358', '#d4a853', '#a8975c', '#7a8f42'];

	onMount(() => {
		onComplete?.(score);
		if (!passed) return;
		pieces = Array.from({ length: 70 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			color: COLORS[Math.floor(Math.random() * COLORS.length)],
			delay: Math.random() * 2.5,
			duration: 2.5 + Math.random() * 2,
			width: 6 + Math.random() * 8,
			height: 10 + Math.random() * 6,
			rotation: Math.random() * 360
		}));
	});
</script>

{#if passed && pieces.length}
	<div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
		{#each pieces as piece (piece.id)}
			<div
				class="confetti-piece absolute top-0"
				style="left:{piece.x}%;width:{piece.width}px;height:{piece.height}px;background:{piece.color};animation-delay:{piece.delay}s;animation-duration:{piece.duration}s;--r:{piece.rotation}deg"
			></div>
		{/each}
	</div>
{/if}

<div class="flex flex-col items-center pt-16 text-center">
	{#if passed}
		<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-olive-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 text-olive-600"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
				/>
			</svg>
		</div>
		<h2 class="mb-2 text-3xl tracking-tight text-olive-950">¡Enhorabuena!</h2>
		<p class="mb-8 text-olive-600">Has superado el quiz</p>
	{:else}
		<div class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-olive-100">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-12 w-12 text-olive-400"
				viewBox="0 0 24 24"
				fill="currentColor"
			>
				<path
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					stroke="currentColor"
					stroke-width="1.5"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
		<h2 class="mb-2 text-3xl tracking-tight text-olive-950">Sigue practicando</h2>
		<p class="mb-8 text-olive-600">No te rindas, inténtalo de nuevo</p>
	{/if}

	<div class="mb-8">
		<span class="text-6xl font-bold {passed ? 'text-olive-950' : 'text-olive-400'}">
			{score.toFixed(2)}
		</span>
		<p class="mt-2 text-olive-600">
			{correct} correctas · {erroneous} erróneas / {total}
		</p>
	</div>

	{#if !passed && onRetry}
		<PrimaryButton label="Reintentar" onclick={onRetry} />
		<button
			class="mt-3 text-sm text-olive-500 underline-offset-2 hover:underline"
			onclick={() => goto(resolve(backHref))}>Volver al curso</button
		>
	{:else}
		<PrimaryButton label="Volver al curso" onclick={() => goto(resolve(backHref))} />
	{/if}
</div>

<style>
	.confetti-piece {
		border-radius: 2px;
		animation: confetti-fall linear forwards;
		transform: rotate(var(--r));
	}

	@keyframes confetti-fall {
		0% {
			transform: translateY(-20px) rotate(var(--r));
			opacity: 1;
		}
		80% {
			opacity: 1;
		}
		100% {
			transform: translateY(105vh) rotate(calc(var(--r) + 720deg));
			opacity: 0;
		}
	}
</style>
