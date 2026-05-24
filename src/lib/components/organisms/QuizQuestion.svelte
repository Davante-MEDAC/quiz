<script lang="ts">
	import { goto } from '$app/navigation';
	import QuizProgress from '../molecules/QuizProgress.svelte';
	import QuestionCard from '../molecules/QuestionCard.svelte';
	import AnswerOption from '../atoms/AnswerOption.svelte';
	import PrimaryButton from '../atoms/PrimaryButton.svelte';

	let {
		questions,
		backHref
	}: {
		questions: QuizFileV1.Question[];
		backHref: string;
	} = $props();

	let currentIndex = $state(0);
	let selected = $state<number | null>(null);

	const question = $derived(questions[currentIndex]);
	const answered = $derived(selected !== null);
	const isLast = $derived(currentIndex === questions.length - 1);

	function selectAnswer(index: number) {
		if (answered) return;
		selected = index;
	}

	function next() {
		if (isLast) {
			goto(backHref);
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

<QuizProgress {backHref} current={currentIndex + 1} total={questions.length} />

{#key currentIndex}
	<QuestionCard question={question.question} />
{/key}

<div class="flex flex-col gap-3">
	{#each question.options as option, i}
		<AnswerOption text={option} state={getState(i)} onclick={() => selectAnswer(i)} />
	{/each}
</div>

<div class="mt-8">
	<PrimaryButton label={isLast ? 'Finalizar' : 'Siguiente'} onclick={next} disabled={!answered} />
</div>
