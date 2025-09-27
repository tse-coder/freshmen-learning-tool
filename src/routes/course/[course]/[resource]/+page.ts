import { ensureCourses, ensureExams, ensureResources } from '../../../../lib/stores/cacheContext';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const courseId = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);

	let courseResources: any[] = [];
	let currentCourse = null;

	if (resourceType === 'exams') {
		try {
			courseResources = await ensureExams(courseId, fetch);
			currentCourse = (await ensureCourses(fetch)).find((c) => c.id === courseId);
		} catch (err) {
			console.error('Failed to fetch exams:', err);
		}
	} else {
		try {
			courseResources = await ensureResources(courseId, fetch);
			currentCourse = (await ensureCourses(fetch)).find((c) => c.id === courseId);
		} catch (err) {
			console.error('Failed to fetch resources:', err);
		}
	}

	const selectedResources =
		resourceType === 'exams'
			? courseResources
			: (courseResources ?? []).filter((r) =>
					String(r.type).toLowerCase().includes(resourceType.toLowerCase())
				);

	return {
		course: currentCourse?.name,
		resourceType,
		resources: selectedResources,
		courseId
	};
};
