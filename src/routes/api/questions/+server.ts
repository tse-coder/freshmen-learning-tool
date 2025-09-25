import { getExamQuestions } from '../../../api/controllers/questions';
import { jsonResponse } from '../../../utils/jsonify';

export const GET = async ({ url }) => {
	const examId = url.searchParams.get('examId') || '';
	if (!examId) {
		return jsonResponse({ error: 'please provide examId' });
	}
	try {
		const questions = await getExamQuestions(examId);
		return jsonResponse(questions);
	} catch (error) {
		return jsonResponse({ error });
	}
};
