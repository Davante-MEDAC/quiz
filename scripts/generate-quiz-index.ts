import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Question {
	id: number;
	type: string;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
}

interface Lesson {
	name: string;
	questions: Question[];
}

interface Subject {
	id: string;
	title: string;
	description: string;
	icon: string;
	lessons: Lesson[];
}

interface SubjectMetadata {
	id: string;
	title: string;
	description: string;
	icon: string;
}

interface SubjectList {
	subjects: SubjectMetadata[];
}

const QUIZZES_DIR = join(process.cwd(), 'static', 'quizzes');
const OUTPUT_FILE = join(process.cwd(), 'static', 'quizzes.json');

function generateSubjectIndex(): void {
	try {
		// Read all JSON files from the quizzes directory
		const files = readdirSync(QUIZZES_DIR).filter((file) => file.endsWith('.json'));

		const subjects: SubjectMetadata[] = [];

		for (const file of files) {
			const filePath = join(QUIZZES_DIR, file);
			const content = readFileSync(filePath, 'utf-8');
			const subjectData: Subject = JSON.parse(content);

			// Validate that the file contains the required Subject structure
			if (!subjectData.id || !subjectData.title || !subjectData.lessons) {
				console.warn(
					`⚠️  Skipping ${file}: Missing required Subject fields (id, title, or lessons)`
				);
				continue;
			}

			// Extract subject metadata
			subjects.push({
				id: subjectData.id,
				title: subjectData.title,
				description: subjectData.description || '',
				icon: subjectData.icon || '📝'
			});
		}

		// Sort subjects by title
		subjects.sort((a, b) => a.title.localeCompare(b.title));

		const subjectList: SubjectList = { subjects };

		writeFileSync(OUTPUT_FILE, JSON.stringify(subjectList, null, 2), 'utf-8');

		console.log(`✅ Generated subject index with ${subjects.length} subjects`);
		console.log(`📝 Output: ${OUTPUT_FILE}`);
		console.log('\nSubjects found:');
		subjects.forEach((subject) => {
			console.log(`  ${subject.icon} ${subject.title}`);
		});
	} catch (error) {
		console.error('❌ Error generating subject index:', error);
		process.exit(1);
	}
}

generateSubjectIndex();
