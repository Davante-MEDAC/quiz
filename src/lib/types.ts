export interface Question {
	id: number;
	type: 'multiple_choice';
	question: string;
	options: string[];
	correctAnswer: number;
	explanation: string;
}

export interface QuizData {
	questions: Question[];
}

export interface Quiz {
	id: string;
	title: string;
	description: string;
	icon: string;
	questionCount: number;
	category: string;
}

export interface QuizList {
	quizzes: Quiz[];
}

export interface QuizState {
	currentQuestionIndex: number;
	selectedAnswer: number | null;
	showFeedback: boolean;
	score: number;
	isComplete: boolean;
	userAnswers: (number | null)[];
}

export interface Subject {
	id: string;
	title: string;
	description: string;
	icon: string;
	items: Item[];
}

export interface Item {
	name: string;
	kind: 'lesson';
	questions: Question[];
}

export interface SubjectList {
	subjects: Subject[];
}
