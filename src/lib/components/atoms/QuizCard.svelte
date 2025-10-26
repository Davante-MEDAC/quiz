<script lang="ts">
	import { quizStore } from '$lib/stores/quiz';

	import type { Question, QuizState } from '$lib/types';

	interface Props {
		question: Question;
		quizState: QuizState;
	}

	let { question, quizState }: Props = $props();

	function selectOption(index: number) {
		if (!quizState.showFeedback) {
			quizStore.selectAnswer(index);
		}
	}

	function getOptionClass(index: number): string {
		const base =
			'bg-background border-2 border-border rounded-xl px-5 py-4 text-left cursor-pointer transition-all duration-200 text-base text-gray-800';

		if (!quizState.showFeedback) {
			return quizState.selectedAnswer === index
				? `${base} !border-primary bg-primary/10`
				: `${base} hover:border-primary hover:bg-primary/5`;
		}

		// Show feedback
		if (index === question.correctAnswer) {
			return `${base} !border-primary bg-primary/20 font-semibold`;
		}
		if (index === quizState.selectedAnswer && index !== question.correctAnswer) {
			return `${base} !border-danger bg-danger/20`;
		}
		return base;
	}
</script>

<div class="bg-surface border-border mb-5 animate-[fadeIn_0.3s_ease-in] rounded-2xl border-2 p-6">
	<h2 class="mb-5 text-xl leading-tight font-semibold text-gray-900">{question.question}</h2>

	<div class="my-6 flex flex-col gap-3">
		{#each question.options as option, index (option)}
			<button
				type="button"
				class={getOptionClass(index)}
				onclick={() => selectOption(index)}
				disabled={quizState.showFeedback}
			>
				{option}
			</button>
		{/each}
	</div>
</div>
