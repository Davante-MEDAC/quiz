import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch('/api/v0/db');
	const db: QuizFileV1 = await res.json();
	const course = db.V1[params.course];

	if (!course) {
		error(404, 'Curso no encontrado');
	}

	return { course };
};
