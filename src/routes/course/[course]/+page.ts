import type { PageLoad } from './$types';
import type { Course } from '../../../types/types';
import { ensureCourses, ensureAllCourseResources } from '../../../lib/stores/cacheContext';

export const load: PageLoad = async ({ params }) => {
	const courseId = params.course ?? '';

	// Load courses from cache or API
	let courses: Course[] = [];
	try {
		courses = await ensureCourses();
	} catch (err) {
		console.error('Failed to fetch courses:', err);
	}

	const finalCourseId = courseId || (courses[0] && courses[0].id) || '';
	const course = courses.find((c: any) => c.id === finalCourseId) ?? courses[0] ?? null;

	// Ensure resources + videos are cached and merged
	let courseResources: any[] = [];
	try {
		courseResources = await ensureAllCourseResources(finalCourseId);
	} catch (err) {
		console.error('Failed to ensure resources for course:', err);
		courseResources = [];
	}

	return {
		course,
		resources: courseResources
	};
};
