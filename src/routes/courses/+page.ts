import type { Course } from '../../types/types';
import { ensureCourses } from '../../lib/stores/cacheContext';

export const load = async () => {
	let fetchedCourses: Course[] = [];
	try {
		fetchedCourses = await ensureCourses();
	} catch (err) {
		console.error('Failed to fetch courses:', err);
		fetchedCourses = [];
	}
	return {
		fetchedCourses
	};
};
