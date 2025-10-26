import type { PageLoad } from './$types';
import type { Subject } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const response = await fetch(`/quizzes/${params.subjectId}.json`);
		const subjectData: Subject = await response.json();

		if (!subjectData.items) {
			return {
				subject: {
					id: params.subjectId,
					title: 'Subject Not Found',
					description: '',
					icon: '❓',
					lessons: []
				},
				lessons: []
			};
		}

		// Map lessons with index as id
		const lessons = subjectData.items.map((item, index) => ({
			id: index.toString(),
			title: item.name,
			icon: '📚',
			questionCount: item.questions.length
		}));

		return {
			subject: subjectData,
			lessons
		};
	} catch (error) {
		console.error('Failed to load subject:', error);
		return {
			subject: {
				id: params.subjectId,
				title: 'Error',
				description: '',
				icon: '❌',
				lessons: []
			},
			lessons: []
		};
	}
};
