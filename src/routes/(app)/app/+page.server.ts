import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/v0/db');
	const db: QuizFileV1 = await res.json();

	const courses = Object.values(db.V1).map(({ id, icon, title, items }) => ({
		id,
		icon,
		title,
		itemCount: items.length
	}));

	return { courses };
};
