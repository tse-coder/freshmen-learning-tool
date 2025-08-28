import type { Course, SampleResourse } from '../types/types';

export const courses: Course[] = [
	{
		id: 'course1',
		name: 'Mathematics',
		modules: 3,
		notes: 2,
		videos: 0
	},
	{
		id: 'course2',
		name: 'History',
		modules: 2,
		notes: 3,
		videos: 0
	},
	{
		id: 'course3',
		name: 'Physics',
		modules: 1,
		notes: 2,
		videos: 0
	},
	{
		id: 'course4',
		name: 'Geography',
		modules: 3,
		notes: 1,
		videos: 0
	}
];

export const resources: SampleResourse[] = [
	{
		id: 'resourse',
		course_Id: 'course1',
		name: 'module1',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course1',
		name: 'module2',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course1',
		name: 'module3',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course1',
		name: 'note1',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course1',
		name: 'note2',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course2',
		name: 'module1',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course2',
		name: 'module2',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course2',
		name: 'note1',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course2',
		name: 'note2',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course2',
		name: 'note3',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course3',
		name: 'module1',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course3',
		name: 'note1',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course3',
		name: 'note2',
		type: 'shortNote'
	},
	{
		id: 'resourse',
		course_Id: 'course4',
		name: 'module1',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course4',
		name: 'module2',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course4',
		name: 'module3',
		type: 'module'
	},
	{
		id: 'resourse',
		course_Id: 'course4',
		name: 'note1',
		type: 'shortNote'
	}
];
