<script lang="ts">
	import type { PageData } from '$lib/$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Quiz App - Select a Subject</title>
	<meta name="description" content="Choose from a variety of subjects to test your knowledge." />
</svelte:head>

<div class="mx-auto max-w-2xl p-5">
	{#if data.subjects.length === 0}
		<div class="bg-surface border-border mb-5 rounded-2xl border-2 p-6">
			<h2>No subjects available</h2>
			<p>Please check back later for new subjects.</p>
		</div>
	{:else}
		<div class="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 py-5 max-md:grid-cols-1">
			{#each data.subjects as subject (subject.id)}
				<a
					href="/subject/{subject.id}"
					class="flex cursor-pointer flex-col items-center rounded-lg border border-gray-200 bg-white p-6 text-center text-inherit no-underline shadow-sm transition-all duration-150 hover:border-yellow-400 hover:shadow-lg"
				>
					<div class="mb-4 text-6xl">{subject.icon}</div>
					<h2 class="m-0 mb-3 text-2xl font-bold text-gray-800">{subject.title}</h2>
					<p class="m-0 mb-4 flex-grow text-base text-gray-500">{subject.description}</p>
				</a>
			{/each}
		</div>
	{/if}
</div>
