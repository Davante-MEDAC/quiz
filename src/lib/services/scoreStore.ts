const STORAGE_KEY = 'quiz_scores';
type ScoreMap = Record<string, number>;

function getMap(): ScoreMap {
	if (typeof localStorage === 'undefined') return {};
	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
	} catch {
		return {};
	}
}

function makeKey(courseId: string, lessonIndex: number) {
	return `${courseId}/${lessonIndex}`;
}

export function saveScore(courseId: string, lessonIndex: number, score: number) {
	const map = getMap();
	map[makeKey(courseId, lessonIndex)] = score;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function getCourseScores(courseId: string): Record<number, number> {
	const map = getMap();
	const result: Record<number, number> = {};
	for (const [key, score] of Object.entries(map)) {
		const parts = key.split('/');
		if (parts[0] === courseId) result[parseInt(parts[1])] = score;
	}
	return result;
}
