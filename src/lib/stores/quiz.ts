import { writable } from 'svelte/store';

import type { QuizState, Question } from '$lib/types';

function createQuizStore() {
	const initialState: QuizState = {
		currentQuestionIndex: 0,
		selectedAnswer: null,
		showFeedback: false,
		score: 0,
		isComplete: false,
		userAnswers: []
	};

	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		reset: () => {
			set({
				currentQuestionIndex: 0,
				selectedAnswer: null,
				showFeedback: false,
				score: 0,
				isComplete: false,
				userAnswers: []
			});
		},
		selectAnswer: (answerIndex: number) => {
			update((state) => ({
				...state,
				selectedAnswer: answerIndex
			}));
		},
		submitAnswer: (questions: Question[]) => {
			update((state) => {
				const currentQuestion = questions[state.currentQuestionIndex];
				const isCorrect = state.selectedAnswer === currentQuestion.correctAnswer;

				const newUserAnswers = [...state.userAnswers];
				newUserAnswers[state.currentQuestionIndex] = state.selectedAnswer;

				return {
					...state,
					showFeedback: true,
					score: isCorrect ? state.score + 1 : state.score,
					userAnswers: newUserAnswers
				};
			});
		},
		nextQuestion: (totalQuestions: number) => {
			update((state) => {
				const nextIndex = state.currentQuestionIndex + 1;
				const isComplete = nextIndex >= totalQuestions;

				return {
					...state,
					currentQuestionIndex: isComplete ? state.currentQuestionIndex : nextIndex,
					selectedAnswer: null,
					showFeedback: false,
					isComplete
				};
			});
		},
		initializeAnswers: (questionCount: number) => {
			update((state) => ({
				...state,
				userAnswers: new Array(questionCount).fill(null)
			}));
		}
	};
}

export const quizStore = createQuizStore();
