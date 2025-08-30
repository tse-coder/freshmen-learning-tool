import { ensureCourses, ensureResources } from '../../../../lib/stores/cacheContext';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const courseId = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);
	let courseResources: any[] = [];
	let currentCourse = null
	try {
		courseResources = await ensureResources(courseId);
		currentCourse = (await ensureCourses()).find(course=>course.id===courseId)
	} catch (err) {
		console.error('Failed to fetch resources:', err);
		courseResources = [];
	}

	const selectedResources = (courseResources ?? []).filter((r) =>
		String(r.type).toLowerCase().includes(String(resourceType).toLowerCase())
	);
	return {
		course: currentCourse?.name,
		resourceType,
		resources: selectedResources
	};
};
