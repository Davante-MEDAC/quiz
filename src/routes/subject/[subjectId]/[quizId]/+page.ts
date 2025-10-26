import type { PageLoad } from './$types';
import type { Subject } from '$lib/types';

const MAX_QUESTIONS = 10;

function shuffleArray<T>(array: T[]): T[] {
	const shuffled = [...array];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const response = await fetch(`/quizzes/${params.subjectId}.json`);
		const subjectData: Subject = await response.json();
		const lessonIndex = parseInt(params.quizId, 10);

		if (isNaN(lessonIndex) || !subjectData.items || lessonIndex >= subjectData.items.length) {
			return {
				subjectId: params.subjectId,
				quizId: params.quizId,
				questions: [],
				totalAvailable: 0
			};
		}

		const lesson = subjectData.items[lessonIndex];
		const allQuestions = lesson.questions || [];
		const shuffledQuestions = shuffleArray(allQuestions);
		const selectedQuestions = shuffledQuestions.slice(0, MAX_QUESTIONS);

		return {
			name: lesson.name,
			subjectId: params.subjectId,
			quizId: params.quizId,
			questions: selectedQuestions,
			totalAvailable: allQuestions.length
		};
	} catch (error) {
		console.error('Failed to load questions:', error);
		return {
			name: 'Desconocido',
			subjectId: params.subjectId,
			quizId: params.quizId,
			questions: [],
			totalAvailable: 0
		};
	}
};
