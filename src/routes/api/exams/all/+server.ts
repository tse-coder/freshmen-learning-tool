import type { RequestHandler } from '@sveltejs/kit';
import { getAllExams } from '../../../../api/controllers/exams';
import { jsonResponse } from '../../../../utils/jsonify';

export const GET: RequestHandler = async ({ request }) => {
	try {
		const exams = await getAllExams();
		return jsonResponse(exams);
	} catch (error) {
		return jsonResponse({ 'couldnt get all exams': error });
	}
};
