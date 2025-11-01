import type { RequestHandler } from '@sveltejs/kit';
import { getExamQuestions } from '../../../api/controllers/questions';
import { asyncHandler } from '../../../lib/server/errors';
import { validateSearchParams, examIdQuerySchema } from '../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const examLimiter = rateLimit(RATE_LIMITS.EXAMS);

const handler = asyncHandler(async ({ url }) => {
	const searchParams = url.searchParams;
	const { examId } = validateSearchParams(examIdQuerySchema, searchParams);

	const questions = await getExamQuestions(examId);
	return new Response(
		JSON.stringify({ ok: true, data: questions }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(examLimiter, handler);
