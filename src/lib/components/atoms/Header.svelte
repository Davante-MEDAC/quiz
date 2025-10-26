<script lang="ts">
	import { page } from '$app/stores';
	import type { Subject } from '$lib/types';

	let subjects: Subject[] = $state([]);

	async function loadSubjects() {
		try {
			const response = await fetch('/quizzes.json');
			const data = await response.json();

			const subjectsData = await Promise.all(
				data.subjects.map(async (subject: any) => {
					try {
						const subjectResponse = await fetch(`/quizzes/${subject.id}.json`);
						return await subjectResponse.json();
					} catch {
						return subject;
					}
				})
			);

			subjects = subjectsData;
		} catch (error) {
			console.error('Failed to load subjects:', error);
		}
	}

	$effect(() => {
		loadSubjects();
	});

	let activeSubjectId = $derived($page.url.pathname.split('/')[2] || null);
</script>

<header
	class="bg-surface border-border sticky top-0 z-50 border-t-2 border-b-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
>
	<div class="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-8 px-5">
		<a
			href="/"
			class="flex shrink-0 items-center gap-2 text-xl font-bold text-sky-500 no-underline transition-opacity hover:opacity-80"
		>
			<span class="text-2xl">📚</span>
			<span class="max-md:hidden">Quiz</span>
		</a>

		<nav
			class="flex flex-1 items-center gap-3 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
		>
			{#each subjects as subject (subject.id)}
				<a
					href="/"
					class="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-transparent bg-gray-100 no-underline transition-all duration-200 hover:bg-gray-200 {activeSubjectId ===
					subject.id
						? '!border-sky-500 bg-sky-100 shadow-[0_4px_8px_rgba(28,176,246,0.2)]'
						: ''}"
					title={subject.title}
				>
					<div class="text-[1.75rem] leading-none max-md:text-2xl">
						{subject.icon}
					</div>
				</a>
			{/each}
		</nav>

		<div class="flex shrink-0 items-center gap-3">
			<!-- Placeholder for future actions -->
		</div>
	</div>
</header>
