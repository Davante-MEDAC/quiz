<script lang="ts">
	import { onMount } from 'svelte';
	import LessonTemplate from '$lib/components/templates/LessonTemplate.svelte';
	import QuizQuestion from '$lib/components/organisms/QuizQuestion.svelte';
	import { addCorrectAnswer, getCorrectAnswerIds } from '$lib/services/correctAnswersStore';

	let { data } = $props();

	const { course, lesson, lessonIndex } = data;

	const QUESTION_COUNT = 10;
	const CORRECT_WEIGHT = 0.25;

	function weightedSample(
		questions: QuizFileV1.Question[],
		correctIds: Set<number>,
		count: number
	): QuizFileV1.Question[] {
		// Weighted sampling without replacement: correctly-answered questions have
		// CORRECT_WEIGHT (0.25) probability weight vs 1.0 for unseen questions,
		// making them appear roughly 1/4 as often. totalWeight is updated
		// incrementally to avoid O(n²) recalculation on each draw.
		const pool = questions.map((q) => ({ q, w: correctIds.has(q.id) ? CORRECT_WEIGHT : 1.0 }));
		const result: QuizFileV1.Question[] = [];
		const take = Math.min(count, pool.length);
		let totalWeight = pool.reduce((sum, { w }) => sum + w, 0);

		for (let i = 0; i < take; i++) {
			let r = Math.random() * totalWeight;
			let idx = pool.length - 1;
			for (let j = 0; j < pool.length; j++) {
				r -= pool[j].w;
				if (r <= 0) {
					idx = j;
					break;
				}
			}
			totalWeight -= pool[idx].w;
			result.push(pool[idx].q);
			pool.splice(idx, 1);
		}

		return result;
	}

	let selectedQuestions = $state<QuizFileV1.Question[]>([]);
	let ready = $state(false);

	onMount(() => {
		const correctIds = getCorrectAnswerIds(course.id, lessonIndex);
		selectedQuestions = weightedSample(lesson.questions, correctIds, QUESTION_COUNT);
		ready = true;
	});

	function handleCorrectAnswer(questionId: number) {
		addCorrectAnswer(course.id, lessonIndex, questionId);
	}
</script>

<svelte:head>
	<title>DMDDA | {lesson.name}</title>
</svelte:head>

{#if ready}
	<LessonTemplate>
		<QuizQuestion
			questions={selectedQuestions}
			backHref="/app/{course.id}"
			courseId={course.id}
			{lessonIndex}
			onCorrectAnswer={handleCorrectAnswer}
		/>
	</LessonTemplate>
{/if}
