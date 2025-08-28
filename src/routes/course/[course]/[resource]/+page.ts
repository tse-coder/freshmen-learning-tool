import { ensureResources } from '../../../../lib/stores/cacheContext';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const courseId = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);
	let courseResources: any[] = [];
	try {
		courseResources = await ensureResources(courseId);
	} catch (err) {
		console.error('Failed to fetch resources:', err);
		courseResources = [];
	}

	const selectedResources = (courseResources ?? []).filter((r) => String(r.type).toLowerCase().includes(String(resourceType).toLowerCase()));
	return {
		course: courseId,
		resourceType,
		resources: selectedResources
	};
};
