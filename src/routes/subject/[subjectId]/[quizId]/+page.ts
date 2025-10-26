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

		// Parse quizId as lesson index
		const lessonIndex = parseInt(params.quizId);

		if (isNaN(lessonIndex) || !subjectData.lessons || lessonIndex >= subjectData.lessons.length) {
			return {
				subjectId: params.subjectId,
				quizId: params.quizId,
				questions: [],
				totalAvailable: 0
			};
		}

		// Get questions from the specific lesson
		const lesson = subjectData.lessons[lessonIndex];
		const allQuestions = lesson.questions || [];

		// Shuffle questions and take only MAX_QUESTIONS
		const shuffledQuestions = shuffleArray(allQuestions);
		const selectedQuestions = shuffledQuestions.slice(0, MAX_QUESTIONS);

		return {
			subjectId: params.subjectId,
			quizId: params.quizId,
			questions: selectedQuestions,
			totalAvailable: allQuestions.length
		};
	} catch (error) {
		console.error('Failed to load questions:', error);
		return {
			subjectId: params.subjectId,
			quizId: params.quizId,
			questions: [],
			totalAvailable: 0
		};
	}
};
