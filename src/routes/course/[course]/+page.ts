// src/routes/course/[course]/+page.ts
import { courses } from '$lib/data/courses';
import { resources } from '$lib/data/resources';
import type { LoadEvent } from '@sveltejs/kit';

export function load({ params }: LoadEvent) {
	const courseName = params.course ?? '';
	const course = courses.find((c) => c.name === courseName);
	const courseResources = resources[courseName];

	if (!course || !courseResources) {
		throw new Error(`Course "${courseName}" not found`);
	}

	return {
		course,
		resources: courseResources
	};
}
