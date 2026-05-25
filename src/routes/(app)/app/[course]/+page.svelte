<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { hasCourseErrors } from '$lib/services/errorStore';
	import { getCourseScores } from '$lib/services/scoreStore';
	import BackButton from '$lib/components/atoms/BackButton.svelte';

	let { data } = $props();

	const { course } = data;
	let hasErrors = $state(false);
	let scores = $state<Record<number, number>>({});

	onMount(() => {
		hasErrors = hasCourseErrors(course.id);
		scores = getCourseScores(course.id);
	});

	const kindCounters: Record<string, number> = {};
	const itemsWithKindIndex = course.items.map((item: QuizFileV1.Item, i: number) => {
		kindCounters[item.kind] = (kindCounters[item.kind] ?? 0) + 1;
		return { ...item, globalIndex: i, kindIndex: kindCounters[item.kind] };
	});

	const kindConfig = {
		lesson: {
			label: 'Lección',
			icon: '📖',
			accent: 'bg-olive-100 text-olive-700'
		},
		quiz: {
			label: 'Quiz',
			icon: '🎯',
			accent: 'bg-olive-200 text-olive-800'
		}
	};
</script>

<svelte:head>
	<title>DMDDA | {course.title}</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-6 flex items-center gap-3">
		<BackButton href="/app" />
		<h1 class="font-semibold text-olive-950">{course.title}</h1>
	</div>

	<div class="mb-6 rounded-2xl border border-olive-200 bg-white p-5">
		<div class="mb-2 text-4xl">{course.icon}</div>
		<p class="text-sm text-olive-700">{course.description}</p>
	</div>

	<div class="flex flex-col gap-3">
		{#if hasErrors}
			<a
				href={resolve(`/app/${course.id}/practice`)}
				class="flex items-center gap-4 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4"
			>
				<div
					class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl"
				>
					⚡
				</div>
				<div class="min-w-0 flex-1">
					<p class="mb-0.5 text-xs font-medium text-rose-400">Repaso</p>
					<p class="truncate font-semibold text-rose-700">Practicar errores</p>
					<p class="text-sm text-rose-500">Respuestas incorrectas anteriores</p>
				</div>
				<span
					class="flex-shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700"
				>
					Repaso
				</span>
			</a>
		{/if}

		{#each itemsWithKindIndex as item (item.name)}
			{@const config = kindConfig[item.kind]}
			<a
				href={resolve(`/app/${course.id}/${item.globalIndex}`)}
				class="flex items-center gap-4 rounded-2xl border border-olive-200 bg-white p-4"
			>
				<div
					class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl {config.accent} text-xl"
				>
					{config.icon}
				</div>
				<div class="min-w-0 flex-1">
					<p class="mb-0.5 text-xs font-medium text-olive-500">
						{config.label}
						{item.kindIndex}
					</p>
					<p class="truncate font-semibold text-olive-950">{item.name}</p>
					<p class="text-sm text-olive-600">{item.questionCount} preguntas</p>
				</div>
				{#if scores[item.globalIndex] !== undefined}
					{@const s = scores[item.globalIndex]}
					<span
						class="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold {s >= 5
							? 'bg-olive-100 text-olive-700'
							: 'bg-red-100 text-red-700'}"
					>
						{s.toFixed(2)}
					</span>
				{:else}
					<span class="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium {config.accent}">
						{config.label}
					</span>
				{/if}
			</a>
		{/each}
	</div>
</div>
