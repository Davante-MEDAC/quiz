<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { hasCourseErrors } from '$lib/services/errorStore';
	import { getCourseScores } from '$lib/services/scoreStore';

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
			accent: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
			dot: 'bg-blue-500'
		},
		quiz: {
			label: 'Quiz',
			icon: '🎯',
			accent: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
			dot: 'bg-amber-500'
		}
	};
</script>

<svelte:head>
	<title>DMDDA | {course.title}</title>
</svelte:head>

<div class="mx-auto max-w-sm px-4 pb-8">
	<div class="mb-6 flex items-center gap-3">
		<a
			href={resolve('/app')}
			class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-700 dark:shadow-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-4 w-4 text-gray-600 dark:text-slate-300"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
					clip-rule="evenodd"
				/>
			</svg>
		</a>
		<h1 class="text-lg font-bold text-gray-900 dark:text-white">{course.title}</h1>
	</div>

	<div class="mb-6 rounded-2xl bg-white p-5 shadow-sm dark:bg-slate-800 dark:shadow-none">
		<div class="mb-2 text-4xl">{course.icon}</div>
		<p class="text-sm text-gray-500 dark:text-slate-400">{course.description}</p>
	</div>

	<div class="flex flex-col gap-3">
		{#if hasErrors}
			<a
				href={resolve(`/app/${course.id}/practice`)}
				class="flex items-center gap-4 rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 transition-shadow hover:shadow-md dark:border-rose-800 dark:bg-rose-950/40 dark:hover:bg-rose-950/60"
			>
				<div
					class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xl dark:bg-rose-900/50"
				>
					⚡
				</div>
				<div class="min-w-0 flex-1">
					<p class="mb-0.5 text-xs font-medium text-rose-400 dark:text-rose-400">Repaso</p>
					<p class="truncate font-semibold text-rose-700 dark:text-rose-300">Practicar errores</p>
					<p class="text-sm text-rose-500 dark:text-rose-400">Respuestas incorrectas anteriores</p>
				</div>
				<span
					class="flex-shrink-0 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-900/50 dark:text-rose-300"
				>
					Repaso
				</span>
			</a>
		{/if}

		{#each itemsWithKindIndex as item (item.name)}
			{@const config = kindConfig[item.kind]}
			<a
				href={resolve(`/app/${course.id}/${item.globalIndex}`)}
				class="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-slate-800 dark:shadow-none dark:hover:bg-slate-700"
			>
				<div
					class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl {config.accent} text-xl"
				>
					{config.icon}
				</div>
				<div class="min-w-0 flex-1">
					<p class="mb-0.5 text-xs font-medium text-gray-400 dark:text-slate-500">
						{config.label}
						{item.kindIndex}
					</p>
					<p class="truncate font-semibold text-gray-900 dark:text-white">{item.name}</p>
					<p class="text-sm text-gray-500 dark:text-slate-400">{item.questionCount} preguntas</p>
				</div>
				{#if scores[item.globalIndex] !== undefined}
					{@const s = scores[item.globalIndex]}
					<span
						class="flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold {s >= 5
							? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
							: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'}"
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
