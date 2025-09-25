import {
	getAllResourcesByCourseId,
	getResourcesByCourseIdandType
} from '../../../api/controllers/resources.js';
import { jsonResponse } from '../../../utils/jsonify.js';

export const GET = async ({ url }) => {
	const type = url.searchParams.get('type') || '';
	const courseId = url.searchParams.get('courseId') || '';
	let data;
	try {
		if (!type) {
			data = await getAllResourcesByCourseId(courseId);
		} else {
			data = await getResourcesByCourseIdandType(courseId, type);
		}
		return jsonResponse(data);
	} catch (error) {
		return jsonResponse({ error: 'couldnt fetch resourses' });
	}
};
