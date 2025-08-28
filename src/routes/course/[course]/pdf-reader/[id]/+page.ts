import type { Resource } from '../../../../../types/types.js';
import { ensureResources } from '../../../../../lib/stores/cacheContext.js';

export const ssr = false;
export const load = async ({ params }) => {
	const courseId = params.course ?? '';
	const resources = await ensureResources(courseId);
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
