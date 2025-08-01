export interface Course {
	name: string;
	modules: number;
	notes: number;
	videos: number;
}

export const courses: Course[] = [
	{ name: 'Chemistry', modules: 3, notes: 5, videos: 2 },
	{ name: 'Psychology', modules: 2, notes: 4, videos: 3 },
	{ name: 'Logic', modules: 2, notes: 3, videos: 2 },
	{ name: 'Physics', modules: 3, notes: 4, videos: 3 },
	{ name: 'English', modules: 2, notes: 3, videos: 1 },
	{ name: 'Biology', modules: 2, notes: 3, videos: 2 },
	{ name: 'Mathematics', modules: 3, notes: 5, videos: 4 },
	{ name: 'Civics', modules: 1, notes: 2, videos: 1 }
];
