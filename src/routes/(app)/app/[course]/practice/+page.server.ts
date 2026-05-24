import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch('/api/v0/db');
	const db: QuizFileV1 = await res.json();

	const subject = db.V1[params.course];
	if (!subject) error(404, 'Curso no encontrado');

	return {
		courseId: subject.id,
		courseTitle: subject.title,
		items: subject.items.map((item, i) => ({
			lessonIndex: i,
			questions: item.questions
		}))
	};
};
