import type { PageLoad } from './$types';
import type { Course } from '../../../types/types';
import {
	ensureCourses,
	ensureAllCourseResources,
	ensureExams
} from '../../../lib/stores/cacheContext';

export const load: PageLoad = async ({ params, fetch }) => {
	const courseId = params.course ?? '';

	let courses: Course[] = [];
	try {
		courses = await ensureCourses(fetch);
	} catch (err) {
		console.error('Failed to fetch courses:', err);
	}

	const finalCourseId = courseId || courses[0]?.id || '';
	const course = courses.find((c) => c.id === finalCourseId) ?? courses[0] ?? null;

	let courseResources: any[] = [];
	let courseExams: any[] = [];
	try {
		courseResources = await ensureAllCourseResources(finalCourseId, fetch);
		courseExams = await ensureExams(finalCourseId, fetch);
	} catch (err) {
		console.error('Failed to ensure resources for course:', err);
	}

	return {
		course,
		resources: courseResources,
		exams: courseExams
	};
};
