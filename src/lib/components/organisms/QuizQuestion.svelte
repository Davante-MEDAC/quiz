<script lang="ts">
	import QuizProgress from '../molecules/QuizProgress.svelte';
	import QuestionCard from '../molecules/QuestionCard.svelte';
	import AnswerOption from '../atoms/AnswerOption.svelte';
	import AnswerFeedback from '../molecules/AnswerFeedback.svelte';
	import QuizSummary from '../molecules/QuizSummary.svelte';
	import { addErrors } from '$lib/services/errorStore';
	import { saveScore } from '$lib/services/scoreStore';

	let {
		questions,
		backHref,
		courseId = undefined,
		lessonIndex = undefined,
		onCorrectAnswer = undefined
	}: {
		questions: QuizFileV1.Question[];
		backHref: string;
		courseId?: string;
		lessonIndex?: number;
		onCorrectAnswer?: (questionId: number) => void;
	} = $props();

	function shuffleQuestion(q: QuizFileV1.Question) {
		const indices = q.options.map((_, i) => i);
		for (let i = indices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[indices[i], indices[j]] = [indices[j], indices[i]];
		}
		return {
			...q,
			options: indices.map((i) => q.options[i]),
			correctAnswer: indices.indexOf(q.correctAnswer)
		};
	}

	let shuffledQuestions = $state(questions.map(shuffleQuestion));

	let currentIndex = $state(0);
	let selected = $state<number | null>(null);
	let correctCount = $state(0);
	let erroneousCount = $state(0);
	let erroneousIds = $state<number[]>([]);
	let showSummary = $state(false);

	const question = $derived(shuffledQuestions[currentIndex]);
	const answered = $derived(selected !== null);
	const isLast = $derived(currentIndex === shuffledQuestions.length - 1);

	function retry() {
		shuffledQuestions = questions.map(shuffleQuestion);
		currentIndex = 0;
		selected = null;
		correctCount = 0;
		erroneousCount = 0;
		erroneousIds = [];
		showSummary = false;
	}

	function selectAnswer(index: number) {
		if (answered) return;
		selected = index;
		if (index === question.correctAnswer) {
			correctCount += 1;
			onCorrectAnswer?.(question.id);
		} else {
			erroneousCount += 1;
			erroneousIds = [...erroneousIds, question.id];
		}
	}

	function next() {
		if (isLast) {
			if (courseId !== undefined && lessonIndex !== undefined && erroneousIds.length > 0) {
				addErrors(courseId, lessonIndex, erroneousIds);
			}
			showSummary = true;
			return;
		}
		currentIndex += 1;
		selected = null;
	}

	function getState(index: number): 'idle' | 'correct' | 'incorrect' {
		if (!answered) return 'idle';
		if (index === question.correctAnswer) return 'correct';
		if (index === selected) return 'incorrect';
		return 'idle';
	}
</script>

{#if showSummary}
	<QuizSummary
		correct={correctCount}
		erroneous={erroneousCount}
		total={shuffledQuestions.length}
		{backHref}
		onRetry={retry}
		onComplete={courseId !== undefined && lessonIndex !== undefined
			? (score) => saveScore(courseId, lessonIndex, score)
			: undefined}
	/>
{:else}
	<QuizProgress {backHref} current={currentIndex + 1} total={shuffledQuestions.length} />

	{#key currentIndex}
		<QuestionCard
			question={question.question}
			onExpire={() => {
				if (!answered) next();
			}}
		/>
	{/key}

	<div class="flex flex-col gap-3" class:pb-52={answered}>
		{#each question.options as option, i (i)}
			<AnswerOption text={option} state={getState(i)} onclick={() => selectAnswer(i)} />
		{/each}
	</div>

	{#if answered}
		<AnswerFeedback
			explanation={question.explanation}
			label={isLast ? 'Finalizar' : 'Siguiente'}
			onclick={next}
		/>
	{/if}
{/if}
