<script lang="ts">
	import { onMount } from 'svelte';
	import confetti from 'canvas-confetti';

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
		if (percentage === 100) return '¡Perfecto! 🌟';
		if (percentage >= 90) return '¡Excelente! 🏆';
		if (percentage >= 80) return '¡Enhorabuena! 🎉';
		if (percentage >= 70) return '¡Sigue así! 👏';
		if (percentage >= 60) return 'Felicidades 👍';
		return 'Continua prácticando! 💪';
	});

	onMount(() => {
		if (percentage >= 10) {
			confetti({
				particleCount: 420,
				spread: 160,
				origin: { y: 0.25 }
			});
		}
	});

	function restartQuiz() {
		quizStore.reset();
	}
</script>

<div
	class="bg-surface border-border mb-5 animate-[fadeIn_0.3s_ease-in] rounded-2xl border-2 p-6 text-center"
>
	<div class="text-primary my-5 text-5xl font-bold">
		{score}/{totalQuestions}
	</div>

	<div class="mb-7 text-xl font-semibold text-gray-800">
		{message()}
	</div>

	<div class="my-7 text-left">
		<h3 class="mb-5 text-center font-bold text-gray-900">Respuestas</h3>
		<div class="border-border bg-background max-h-[300px] overflow-y-auto rounded-lg border p-4">
			{#each questions as question, index (question.id)}
				<div class="border-border mb-4 border-b pb-4 last:mb-0 last:border-0 last:pb-0">
					<div class="mb-2 font-semibold text-gray-800">
						{index + 1}. {question.question}
					</div>
					<div
						class="rounded-md p-2 text-sm {userAnswers[index] === question.correctAnswer
							? 'bg-primary/20 text-primary'
							: 'bg-danger/20 text-danger'}"
					>
						Tú respuesta: {userAnswers[index] !== null
							? question.options[userAnswers[index]]
							: 'No answer'}
						{#if userAnswers[index] !== question.correctAnswer}
							<br /><small class="text-gray-600"
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
		Reintentar
	</button>
</div>
