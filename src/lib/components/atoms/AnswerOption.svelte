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
	class="flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left font-medium transition-colors"
	class:border-gray-200={state === 'idle'}
	class:bg-white={state === 'idle'}
	class:text-gray-800={state === 'idle'}
	class:hover:border-gray-300={state === 'idle'}
	class:dark:border-slate-600={state === 'idle'}
	class:dark:bg-slate-800={state === 'idle'}
	class:dark:text-white={state === 'idle'}
	class:dark:hover:border-slate-500={state === 'idle'}
	class:border-sky-400={state === 'correct'}
	class:bg-sky-50={state === 'correct'}
	class:text-sky-600={state === 'correct'}
	class:border-red-400={state === 'incorrect'}
	class:bg-red-50={state === 'incorrect'}
	class:text-red-500={state === 'incorrect'}
>
	<span>{text}</span>
	{#if state === 'correct'}
		<span
			class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500 text-white"
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
		<span class="h-6 w-6 flex-shrink-0 rounded-full border-2 border-gray-300 dark:border-slate-500"
		></span>
	{/if}
</button>
