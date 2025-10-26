<script lang="ts">
	import { onMount } from 'svelte';

	import { quizStore } from '$lib/stores/quiz';
	import QuizCard from '$lib/components/atoms/QuizCard.svelte';
	import ProgressBar from '$lib/components/atoms/ProgressBar.svelte';
	import Results from '$lib/components/atoms/Results.svelte';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let showExitModal = $state(false);

	onMount(() => {
		// Reset quiz state when entering a new quiz
		quizStore.reset();

		if (data.questions.length > 0) {
			quizStore.initializeAnswers(data.questions.length);
		}
	});

	function handleSubmit() {
		if ($quizStore.selectedAnswer !== null) {
			quizStore.submitAnswer(data.questions);
		}
	}

	function handleNext() {
		quizStore.nextQuestion(data.questions.length);
	}

	function openExitModal() {
		showExitModal = true;
	}

	function closeExitModal() {
		showExitModal = false;
	}

	let currentQuestion = $derived(data.questions[$quizStore.currentQuestionIndex]);
	let canSubmit = $derived($quizStore.selectedAnswer !== null && !$quizStore.showFeedback);
	let showNext = $derived($quizStore.showFeedback && !$quizStore.isComplete);
	let quizId = parseInt(data.quizId, 10) + 1;
</script>

<svelte:head>
	<title>DMDDA | Quiz - #{quizId}</title>
	<meta
		name="description"
		content="Test your knowledge with our interactive quiz app inspired by Duolingo."
	/>
</svelte:head>

{#if data.questions.length === 0}
	<div class="mx-auto max-w-2xl p-5">
		<div class="bg-surface border-border mb-5 rounded-2xl border-2 p-6">
			<h1 class="text-gray-900">Ocurrió un problema cargando el Quiz</h1>
			<p class="text-gray-700">No es posible cargar la información del Quiz</p>
			<a
				href="/subject/{data.subjectId}"
				class="bg-primary hover:bg-primary-dark inline-block min-w-[120px] cursor-pointer rounded-xl border-none px-6 py-4 text-center text-base font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
				>Volver a la Asignatura</a
			>
		</div>
	</div>
{:else if $quizStore.isComplete}
	<div class="mx-auto max-w-2xl p-5">
		<Results
			score={$quizStore.score}
			totalQuestions={data.questions.length}
			questions={data.questions}
			userAnswers={$quizStore.userAnswers}
		/>
		<div class="mt-5 flex justify-center gap-3 pb-5">
			<a
				href="/subject/{data.subjectId}"
				class="bg-secondary inline-block min-w-[200px] cursor-pointer rounded-xl border-none px-6 py-4 text-center text-base font-semibold text-black no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e6b300]"
				>Volver a la Asignatura</a
			>
		</div>
	</div>
{:else if currentQuestion}
	<div class="mx-auto max-w-2xl p-5 pb-32">
		<header class="mb-7 grid grid-cols-[auto_100px]">
			<h1 class="text-primary flex w-full items-center justify-start text-2xl font-bold">
				#{quizId} - {data.name}
			</h1>
			<div class="flex items-center gap-4">
				<div class="text-secondary flex items-center gap-2 font-semibold">
					<span>🏆</span>
					<span>{$quizStore.score}</span>
				</div>
				<button
					type="button"
					onclick={openExitModal}
					class="bg-background border-border hover:border-danger hover:text-danger flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border-2 text-gray-600 transition-all duration-200"
					aria-label="Exit quiz"
				>
					⚙️
				</button>
			</div>
		</header>

		<ProgressBar current={$quizStore.currentQuestionIndex + 1} total={data.questions.length} />

		<QuizCard question={currentQuestion} quizState={$quizStore} />
	</div>

	{#if showExitModal}
		<div
			class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
			onclick={closeExitModal}
		>
			<div
				class="bg-background border-border mx-4 max-w-md rounded-2xl border-2 p-6 shadow-xl"
				onclick={(e) => e.stopPropagation()}
			>
				<h2 class="mb-4 text-2xl font-bold text-gray-900">Salir del Quiz</h2>
				<p class="mb-6 text-gray-700">
					¿Estás seguro de que quieres salir? Tu progreso se perderá.
				</p>
				<div class="flex gap-3">
					<button
						type="button"
						onclick={closeExitModal}
						class="bg-surface border-border hover:border-primary flex-1 rounded-xl border-2 px-6 py-3 font-semibold text-gray-800 transition-all duration-200"
					>
						Cancelar
					</button>
					<a
						href="/subject/{data.subjectId}"
						class="bg-danger flex-1 rounded-xl px-6 py-3 text-center font-semibold text-white no-underline transition-all duration-200 hover:bg-[#e63946]"
					>
						Salir
					</a>
				</div>
			</div>
		</div>
	{/if}

	{#if $quizStore.showFeedback}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
			<div
				class="bg-background border-border mx-4 max-w-md rounded-2xl border-2 p-6 shadow-xl"
			>
				<h2
					class="mb-4 text-2xl font-bold {$quizStore.selectedAnswer ===
					currentQuestion.correctAnswer
						? 'text-primary'
						: 'text-danger'}"
				>
					{#if $quizStore.selectedAnswer === currentQuestion.correctAnswer}
						🎉 ¡Correcto!
					{:else}
						❌ Incorrecto
					{/if}
				</h2>
				<p class="mb-6 text-gray-700">
					{currentQuestion.explanation}
				</p>
				<div class="flex gap-3">
					{#if showNext}
						<button
							type="button"
							class="bg-secondary hover:bg-secondary/90 w-full rounded-xl border-none px-6 py-3 font-semibold text-white transition-all duration-200"
							onclick={handleNext}
						>
							Continuar
						</button>
					{:else}
						<button
							type="button"
							class="bg-primary hover:bg-primary-dark w-full rounded-xl border-none px-6 py-3 font-semibold text-white transition-all duration-200"
							onclick={handleNext}
						>
							Ver resultados
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<div
		class="bg-background border-border fixed right-0 bottom-0 left-0 border-t-2 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]"
	>
		<div class="mx-auto max-w-2xl p-2 md:p-5">
			<div class="flex justify-center gap-3">
				<button
					type="button"
					class="bg-primary hover:bg-primary-dark min-w-[200px] cursor-pointer rounded-xl border-none px-2 py-4 text-center text-base font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 md:px-6 md:py-4"
					onclick={handleSubmit}
					disabled={!canSubmit}
				>
					Confirmar
				</button>
			</div>
		</div>
	</div>
{/if}
