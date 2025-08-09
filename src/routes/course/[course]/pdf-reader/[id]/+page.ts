import type { Resource } from '../../../../../types/types.js';
import { fetchAllResources } from '../../../../../api/fetcher.js';

export const ssr = false;
export const load = async ({ params }) => {
	const courseId = params.course ?? '';
	const resources = await fetchAllResources(courseId);
	const resourceId = params.id;

	// Find the matching resource
	const resource: Resource | undefined = resources?.find((r: Resource) => r.id == resourceId);

	if (!resource) {
		throw new Error(`Resource "${resourceId}" not found`);
	}

	return {
		resource
	};
};
