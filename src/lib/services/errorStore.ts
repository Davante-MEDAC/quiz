const STORAGE_KEY = 'quiz_errors';
type ErrorMap = Record<string, true>;

function getMap(): ErrorMap {
	if (typeof localStorage === 'undefined') return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
	} catch {
		return {};
	}
}

function saveMap(map: ErrorMap) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function makeKey(courseId: string, lessonIndex: number, questionId: number) {
	return `${courseId}/${lessonIndex}/${questionId}`;
}

export function addErrors(courseId: string, lessonIndex: number, questionIds: number[]) {
	const map = getMap();
	for (const id of questionIds) map[makeKey(courseId, lessonIndex, id)] = true;
	saveMap(map);
}

export function removeError(courseId: string, lessonIndex: number, questionId: number) {
	const map = getMap();
	delete map[makeKey(courseId, lessonIndex, questionId)];
	saveMap(map);
}

export function hasCourseErrors(courseId: string): boolean {
	const map = getMap();
	return Object.keys(map).some((k) => k.startsWith(`${courseId}/`));
}

export function getCourseErrorKeys(
	courseId: string
): Array<{ lessonIndex: number; questionId: number }> {
	const map = getMap();
	return Object.keys(map)
		.filter((k) => k.startsWith(`${courseId}/`))
		.map((k) => {
			const parts = k.split('/');
			return { lessonIndex: parseInt(parts[1]), questionId: parseInt(parts[2]) };
		});
}
