import type { PageLoad } from './$types';
import { fetchAllResources, fetchCourses } from '../../../api/fetcher';

export const load: PageLoad = async ({ params }) => {
	const courseId = params.course ?? '';
	const courses = await fetchCourses();

	if (!courses) {
		throw new Error('Courses not loaded');
	}

	// Find the matching course
	const course = courses.find((c) => c.id === courseId);

	if (!course) {
		throw new Error(`Course "${courseId}" not found`);
	}

	// Fetch resources for the course
	const courseResources = await fetchAllResources(course.id);

	return {
		course,
		resources: courseResources
	};
};
