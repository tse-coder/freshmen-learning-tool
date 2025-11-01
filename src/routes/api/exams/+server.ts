import type { RequestHandler } from '@sveltejs/kit';
import { getExamDataByCourseId } from '../../../api/controllers/exams';
import { asyncHandler } from '../../../lib/server/errors';
import { validateSearchParams, courseIdQuerySchema } from '../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const examLimiter = rateLimit(RATE_LIMITS.EXAMS);

const handler = asyncHandler(async ({ url }) => {
	const searchParams = url.searchParams;
	const { courseId } = validateSearchParams(courseIdQuerySchema, searchParams);

	const data = await getExamDataByCourseId(courseId);
	return new Response(
		JSON.stringify({ ok: true, data }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(examLimiter, handler);
