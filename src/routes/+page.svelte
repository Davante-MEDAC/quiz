<script lang="ts">
	import type { PageData } from '$lib/$types';
	import Header from '$lib/components/atoms/Header.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Quiz App - Select a Subject</title>
	<meta name="description" content="Choose from a variety of subjects to test your knowledge." />
</svelte:head>

<Header />
<div class="mx-auto max-w-2xl p-5">
	{#if data.subjects.length === 0}
		<div class="bg-surface border-border mb-5 rounded-2xl border-2 p-6">
			<h2 class="text-gray-900">No subjects available</h2>
			<p class="text-gray-700">Please check back later for new subjects.</p>
		</div>
	{:else}
		<div class="flex flex-col gap-6">
			{#each data.subjects as subject (subject.id)}
				<a
					href="/subject/{subject.id}"
					class="bg-primary-dark/10 hover:bg-primary-dark/20 border-2 border-border hover:border-primary grid cursor-pointer grid-cols-[100px_auto] items-center rounded-lg p-6 text-center text-inherit no-underline shadow-sm transition-all duration-150"
				>
					<div class="col-start-1 flex flex-col items-center justify-center text-left text-4xl">
						{subject.icon}
					</div>
					<h2
						class="col-start-2 flex w-full flex-col items-start justify-center text-left text-2xl font-bold text-gray-800"
					>
						{subject.title}
					</h2>
				</a>
			{/each}
		</div>
	{/if}
</div>
