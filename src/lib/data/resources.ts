export interface Resource {
	id: number;
	title: string;
	type: string;
	url: string;
}

export interface VideoResource extends Resource {
	thumbnail: string;
}

export interface CourseResources {
	modules: Resource[];
	exams: Resource[];
	quizzes: Resource[];
	shortNotes: Resource[];
	videos: VideoResource[];
}

export const resources: Record<string, CourseResources> = {
	Mathematics: {
		modules: [
			{ id: 1, title: 'Algebra Basics', type: 'PDF', url: '#' },
			{ id: 2, title: 'Calculus I', type: 'PDF', url: '#' },
			{ id: 3, title: 'Linear Equations', type: 'PDF', url: '#' }
		],
		exams: [
			{ id: 1, title: 'Midterm Exam', type: 'Mid', url: '#' },
			{ id: 2, title: 'Final Exam', type: 'Final', url: '#' }
		],
		quizzes: [
			{ id: 1, title: 'Functions Quiz', type: 'MCQ', url: '#' },
			{ id: 2, title: 'Integrals Quiz', type: 'MCQ', url: '#' }
		],
		shortNotes: [
			{ id: 1, title: 'Derivative Rules', type: 'PDF', url: '#' },
			{ id: 2, title: 'Algebra Summary', type: 'PDF', url: '#' }
		],
		videos: [
			{
				id: 1,
				title: 'Intro to Calculus',
				type: 'Video',
				url: 'https://www.youtube.com/embed/WUvTyaaNkzM',
				thumbnail: 'https://img.youtube.com/vi/WUvTyaaNkzM/mqdefault.jpg'
			},
			{
				id: 2,
				title: 'Algebra Explained',
				type: 'Video',
				url: 'https://www.youtube.com/embed/OGzPmgsI-pQ',
				thumbnail: 'https://img.youtube.com/vi/OGzPmgsI-pQ/mqdefault.jpg'
			}
		]
	},

	Physics: {
		modules: [
			{ id: 1, title: 'Mechanics', type: 'PDF', url: '#' },
			{ id: 2, title: 'Electromagnetism', type: 'PDF', url: '#' }
		],
		exams: [
			{ id: 1, title: 'Midterm Physics', type: 'Mid', url: '#' },
			{ id: 2, title: 'Final Physics', type: 'Final', url: '#' }
		],
		quizzes: [{ id: 1, title: 'Kinematics Quiz', type: 'MCQ', url: '#' }],
		shortNotes: [{ id: 1, title: 'Newton’s Laws', type: 'PDF', url: '#' }],
		videos: [
			{
				id: 1,
				title: 'Laws of Motion',
				type: 'Video',
				url: 'https://www.youtube.com/embed/kKKM8Y-u7ds',
				thumbnail: 'https://img.youtube.com/vi/kKKM8Y-u7ds/mqdefault.jpg'
			}
		]
	},

	Chemistry: {
		modules: [{ id: 1, title: 'Periodic Table', type: 'PDF', url: '#' }],
		exams: [
			{ id: 1, title: 'Midterm Chemistry', type: 'Mid', url: '#' },
			{ id: 2, title: 'Final Chemistry', type: 'Final', url: '#' }
		],
		quizzes: [],
		shortNotes: [{ id: 1, title: 'Atomic Structure', type: 'PDF', url: '#' }],
		videos: [
			{
				id: 1,
				title: 'Chemical Bonds',
				type: 'Video',
				url: 'https://www.youtube.com/embed/QXT4OVM4vXI',
				thumbnail: 'https://img.youtube.com/vi/QXT4OVM4vXI/mqdefault.jpg'
			}
		]
	},

	Psychology: {
		modules: [{ id: 1, title: 'Intro to Psychology', type: 'PDF', url: '#' }],
		exams: [{ id: 1, title: 'Midterm Psych', type: 'Mid', url: '#' }],
		quizzes: [],
		shortNotes: [],
		videos: [
			{
				id: 1,
				title: 'What is Psychology?',
				type: 'Video',
				url: 'https://www.youtube.com/embed/vo4pMVb0R6M',
				thumbnail: 'https://img.youtube.com/vi/vo4pMVb0R6M/mqdefault.jpg'
			}
		]
	},

	Logic: {
		modules: [{ id: 1, title: 'Logical Reasoning', type: 'PDF', url: '#' }],
		exams: [],
		quizzes: [],
		shortNotes: [],
		videos: []
	},

	English: {
		modules: [{ id: 1, title: 'Grammar Module', type: 'PDF', url: '#' }],
		exams: [],
		quizzes: [],
		shortNotes: [],
		videos: [
			{
				id: 1,
				title: 'Speaking Practice',
				type: 'Video',
				url: 'https://www.youtube.com/embed/WhC5lz_zQG4',
				thumbnail: 'https://img.youtube.com/vi/WhC5lz_zQG4/mqdefault.jpg'
			}
		]
	},

	Biology: {
		modules: [{ id: 1, title: 'Cell Biology', type: 'PDF', url: '#' }],
		exams: [{ id: 1, title: 'Midterm Biology', type: 'Mid', url: '#' }],
		quizzes: [],
		shortNotes: [],
		videos: [
			{
				id: 1,
				title: 'The Cell Structure',
				type: 'Video',
				url: 'https://www.youtube.com/embed/URUJD5NEXC8',
				thumbnail: 'https://img.youtube.com/vi/URUJD5NEXC8/mqdefault.jpg'
			}
		]
	},

	Civics: {
		modules: [{ id: 1, title: 'Rights and Duties', type: 'PDF', url: '#' }],
		exams: [],
		quizzes: [],
		shortNotes: [],
		videos: [
			{
				id: 1,
				title: 'Introduction to Civics',
				type: 'Video',
				url: 'https://www.youtube.com/embed/hML_PfK2rRc',
				thumbnail: 'https://img.youtube.com/vi/hML_PfK2rRc/mqdefault.jpg'
			}
		]
	}
};
