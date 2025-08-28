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
}

export interface SampleResourse {
	id: string;
	name: string;
	type: 'shortNote' | 'module' | 'video';
	course_Id: string;
}
