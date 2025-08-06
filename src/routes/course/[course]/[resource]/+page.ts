import { fetchResources } from '../../../../api/fetcher';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const courseId = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);

	const courseResources = fetchResources(courseId, resourceType);

	if (!courseResources) {
		throw new Error(`Course "${courseId}" not found.`);
	}

	const selectedResources = courseResources[resourceType as keyof typeof courseResources] ?? [];
	return {
		course: courseId,
		resourceType,
		resources: selectedResources
	};
};
