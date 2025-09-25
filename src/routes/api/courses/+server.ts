// make a route to get all courses

import type { RequestHandler } from '@sveltejs/kit';
import { getCourses } from '../../../api/controllers/courses';
import { jsonResponse } from '../../../utils/jsonify';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const courses = await getCourses();
		return jsonResponse(courses);
	} catch (err: any) {
		return jsonResponse({ error: 'failed to fetch courses' });
	}
};
