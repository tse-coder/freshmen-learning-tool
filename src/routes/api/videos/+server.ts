import { error } from '@sveltejs/kit';
import { jsonResponse } from '../../../utils/jsonify.js';
import { getVideosByCourseId } from '../../../api/controllers/videos';

export const GET = async ({ url }) => {
	const courseId = url.searchParams.get('courseId');

	if (!courseId) {
		return jsonResponse({ error: 'courseId is required' });
	}
	try {
		const videos = await getVideosByCourseId(courseId);
		return jsonResponse(videos);
	} catch (error) {
		return jsonResponse({ error: 'failed to fetch videos' });
	}
};
