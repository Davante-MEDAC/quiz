<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import LessonTemplate from '$lib/components/templates/LessonTemplate.svelte';
	import QuizQuestion from '$lib/components/organisms/QuizQuestion.svelte';
	import { getCourseErrorKeys, removeError } from '$lib/services/errorStore';

	let { data } = $props();
	const { courseId, courseTitle, items } = data;

	let practiceQuestions = $state<QuizFileV1.Question[]>([]);
	const lessonIndexById = new SvelteMap<number, number>();
	let ready = $state(false);

	onMount(() => {
		const errorKeys = getCourseErrorKeys(courseId);
		if (errorKeys.length === 0) {
			goto(resolve(`/app/${courseId}`));
			return;
		}

		const questions: QuizFileV1.Question[] = [];
		for (const { lessonIndex, questionId } of errorKeys) {
			const item = items.find((i: { lessonIndex: number }) => i.lessonIndex === lessonIndex);
			if (!item) continue;
			const q = item.questions.find((q: QuizFileV1.Question) => q.id === questionId);
			if (!q) continue;
			questions.push(q);
			lessonIndexById.set(q.id, lessonIndex);
		}

		practiceQuestions = questions;
		ready = true;
	});

	function handleCorrectAnswer(questionId: number) {
		const li = lessonIndexById.get(questionId);
		if (li !== undefined) removeError(courseId, li, questionId);
	}
</script>

<svelte:head>
	<title>DMDDA | Practicar errores — {courseTitle}</title>
</svelte:head>

{#if ready && practiceQuestions.length > 0}
	<LessonTemplate>
		<QuizQuestion
			questions={practiceQuestions}
			backHref="/app/{courseId}"
			onCorrectAnswer={handleCorrectAnswer}
		/>
	</LessonTemplate>
{/if}
