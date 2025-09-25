import { getExamDataByCourseId } from '../../../api/controllers/exams';
import { jsonResponse } from '../../../utils/jsonify';

export const GET = async ({ url }) => {
	const courseId = url.searchParams.get('courseId') || '';
	try {
		const data = await getExamDataByCourseId(courseId);
		return jsonResponse(data);
	} catch (error) {
		return jsonResponse({ error: `unable to fetch exams for course : ${courseId}` });
	}
};
