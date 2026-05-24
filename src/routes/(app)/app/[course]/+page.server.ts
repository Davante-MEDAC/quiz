import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch('/api/v0/db');
	const db: QuizFileV1 = await res.json();

	const subject = db.V1[params.course];
	if (!subject) error(404, 'Curso no encontrado');

	const course = {
		id: subject.id,
		title: subject.title,
		icon: subject.icon,
		description: subject.description,
		items: subject.items.map(({ kind, name, questions }) => ({
			kind,
			name,
			questionCount: questions.length
		}))
	};

	return { course };
};
