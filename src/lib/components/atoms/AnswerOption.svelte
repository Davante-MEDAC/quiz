<script lang="ts">
	type State = 'idle' | 'correct' | 'incorrect';

	let {
		text,
		state = 'idle',
		onclick
	}: { text: string; state?: State; onclick?: () => void } = $props();
</script>

<button
	{onclick}
	class="flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left font-medium transition-colors"
	class:border-olive-200={state === 'idle'}
	class:bg-white={state === 'idle'}
	class:text-olive-950={state === 'idle'}
	class:hover:border-olive-400={state === 'idle'}
	class:border-olive-500={state === 'correct'}
	class:bg-olive-50={state === 'correct'}
	class:text-olive-700={state === 'correct'}
	class:border-red-300={state === 'incorrect'}
	class:bg-red-50={state === 'incorrect'}
	class:text-red-600={state === 'incorrect'}
>
	<span>{text}</span>
	{#if state === 'correct'}
		<span
			class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-olive-600 text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	{:else if state === 'incorrect'}
		<span
			class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-400 text-white"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</span>
	{:else}
		<span class="h-6 w-6 flex-shrink-0 rounded-full border-2 border-olive-200"></span>
	{/if}
</button>
