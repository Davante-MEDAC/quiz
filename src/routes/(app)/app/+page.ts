import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('/db.json');
	const db: QuizFileV1 = await res.json();

	const courses = Object.values(db.V1);

	return { courses };
};
