const STORAGE_KEY = 'quiz_correct_answers';
type CorrectAnswerMap = Record<string, true>;

function getMap(): CorrectAnswerMap {
	if (typeof localStorage === 'undefined') return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
	} catch {
		return {};
	}
}

function saveMap(map: CorrectAnswerMap) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
	} catch {
		// Ignore storage quota errors
	}
}

function makeKey(courseId: string, lessonIndex: number, questionId: number) {
	return `${courseId}/${lessonIndex}/${questionId}`;
}

export function addCorrectAnswer(courseId: string, lessonIndex: number, questionId: number) {
	const map = getMap();
	map[makeKey(courseId, lessonIndex, questionId)] = true;
	saveMap(map);
}

export function getCorrectAnswerIds(courseId: string, lessonIndex: number): Set<number> {
	const map = getMap();
	const prefix = `${courseId}/${lessonIndex}/`;
	const ids = new Set<number>();
	for (const key of Object.keys(map)) {
		if (key.startsWith(prefix)) {
			const id = parseInt(key.slice(prefix.length), 10);
			if (!isNaN(id)) ids.add(id);
		}
	}
	return ids;
}
