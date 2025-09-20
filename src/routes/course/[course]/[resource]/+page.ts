import { ensureCourses, ensureExams, ensureResources } from '../../../../lib/stores/cacheContext';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const courseId = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);
	let courseResources: any[] = [];
	let currentCourse = null
	// if coursetype is exam fetch exams
	if (resourceType === 'exams') {
		try {
			courseResources = (await ensureExams(courseId));
			currentCourse = (await ensureCourses()).find(course=>course.id===courseId)
		}catch (err) {
			console.error('Failed to fetch exams:', err);
			courseResources = [];
		}
	}else{
		try {
			courseResources = await ensureResources(courseId);
			currentCourse = (await ensureCourses()).find(course=>course.id===courseId)
		} catch (err) {
			console.error('Failed to fetch resources:', err);
			courseResources = [];
		}
	}

	const selectedResources = resourceType=='exams' ? courseResources : (courseResources ?? []).filter((r) =>
		String(r.type).toLowerCase().includes(String(resourceType).toLowerCase())
	);
	return {
		course: currentCourse?.name,
		resourceType,
		resources: selectedResources
	};
};
