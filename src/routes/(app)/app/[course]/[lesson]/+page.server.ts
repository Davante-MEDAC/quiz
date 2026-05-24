import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch('/api/v0/db');
	const db: QuizFileV1 = await res.json();

	const subject = db.V1[params.course];
	if (!subject) error(404, 'Curso no encontrado');

	const lessonIndex = parseInt(params.lesson, 10);
	const lesson = subject.items[lessonIndex];
	if (!lesson) error(404, 'Lección no encontrada');

	return {
		course: { id: subject.id },
		lesson: { name: lesson.name, questions: lesson.questions },
		lessonIndex
	};
};
