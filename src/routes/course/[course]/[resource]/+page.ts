// src/routes/course/[course]/[resource]/+page.ts
import { resources } from '$lib/data/resources';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const courseName = decodeURIComponent(params.course);
	const resourceType = decodeURIComponent(params.resource);

	const courseResources = resources[courseName as keyof typeof resources];

	if (!courseResources) {
		throw new Error(`Course "${courseName}" not found.`);
	}

	const selectedResources = courseResources[resourceType as keyof typeof courseResources] ?? [];
	return {
		course: courseName,
		resourceType,
		resources: selectedResources
	};
};
