import type { RequestHandler } from '@sveltejs/kit';
import { getAllExams } from '../../../../api/controllers/exams';
import { asyncHandler } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';

const examLimiter = rateLimit(RATE_LIMITS.EXAMS);

const handler = asyncHandler(async () => {
	const exams = await getAllExams();
	return new Response(
		JSON.stringify({ ok: true, data: exams }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(examLimiter, handler);
