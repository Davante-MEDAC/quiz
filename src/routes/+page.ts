import type { PageLoad } from './$types';
import type { SubjectList, Subject } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch('/quizzes.json');
		const data: SubjectList = await response.json();

		// Load full subject data with lessons
		const subjectsWithLessons = await Promise.all(
			data.subjects.map(async (subject) => {
				try {
					const subjectResponse = await fetch(`/quizzes/${subject.id}.json`);
					const subjectData: Subject = await subjectResponse.json();
					return subjectData;
				} catch (error) {
					console.error(`Failed to load subject ${subject.id}:`, error);
					return subject;
				}
			})
		);

		return {
			subjects: subjectsWithLessons
		};
	} catch (error) {
		console.error('Failed to load subjects:', error);
		return {
			subjects: []
		};
	}
};
