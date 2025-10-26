<script lang="ts">
	import { quizStore } from '$lib/stores/quiz';
	import type { Question } from '$lib/types';

	interface Props {
		score: number;
		totalQuestions: number;
		questions: Question[];
		userAnswers: (number | null)[];
	}

	let { score, totalQuestions, questions, userAnswers }: Props = $props();

	let percentage = $derived(Math.round((score / totalQuestions) * 100));

	let message = $derived(() => {
		if (percentage >= 90) return 'Outstanding! 🏆';
		if (percentage >= 80) return 'Great job! 🎉';
		if (percentage >= 70) return 'Good work! 👏';
		if (percentage >= 60) return 'Not bad! 👍';
		return 'Keep practicing! 💪';
	});

	function restartQuiz() {
		quizStore.reset();
	}
</script>

<div
	class="bg-surface border-border mb-5 animate-[fadeIn_0.3s_ease-in] rounded-2xl border-2 p-6 text-center"
>
	<h1>Quiz Complete!</h1>

	<div class="text-primary my-5 text-5xl font-bold">
		{score}/{totalQuestions}
	</div>

	<div class="text-secondary my-2.5 text-3xl font-bold">
		{percentage}%
	</div>

	<div class="mb-7 text-xl">
		{message}
	</div>

	<div class="my-7 text-left">
		<h3 class="mb-5 text-center">Review your answers:</h3>
		<div class="border-border max-h-[300px] overflow-y-auto rounded-lg border p-4">
			{#each questions as question, index}
				<div class="border-border mb-4 border-b pb-4 last:mb-0 last:border-0 last:pb-0">
					<div class="mb-2 font-semibold">
						{index + 1}. {question.question}
					</div>
					<div
						class="rounded-md p-2 text-sm {userAnswers[index] === question.correctAnswer
							? 'bg-primary/20 text-primary'
							: 'bg-danger/20 text-danger'}"
					>
						Your answer: {userAnswers[index] !== null
							? question.options[userAnswers[index]]
							: 'No answer'}
						{#if userAnswers[index] !== question.correctAnswer}
							<br /><small class="text-gray-400"
								>Correct: {question.options[question.correctAnswer]}</small
							>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<button
		class="bg-primary hover:bg-primary-dark min-w-[120px] cursor-pointer rounded-xl border-none px-6 py-4 text-center text-base font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
		onclick={restartQuiz}
	>
		Try Again
	</button>
</div>
