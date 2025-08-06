import { resourcesStore } from '$lib/stores/resourcesContext';
import { get } from 'svelte/store';
import type { Resource } from '../../../../../types/types.js';

export const ssr = false;
export const load = async ({ params }) => {
	const courseId = params.course ?? '';
	const resources = get(resourcesStore);
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
