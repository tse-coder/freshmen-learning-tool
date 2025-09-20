export interface Resource {
	id: string;
	title: string;
	type: string;
	url: string;
	thumbnail?: string;
}

export interface VideoResource extends Resource {
	thumbnail: string;
}

export interface Course {
	id: string;
	name: string;
	modules: number;
	notes: number;
	videos: number;
	exams?: number;
}

export interface SampleResourse {
	id: string;
	name: string;
	type: 'shortNote' | 'module' | 'video';
	course_Id: string;
}
export interface ExamResource {
	id: string;
	title: string;
	description: string;
	duration: number; // in minutes
	courseId: string;
	totalQuestions: number;
	thumbnail?: string;
}

export interface ExamQuestion {
	id: string;
	question: string;
	type: 'multiple_choice' | 'fill_in_blank';
	options?: string[];
	answer: string;
	examId: string;
}