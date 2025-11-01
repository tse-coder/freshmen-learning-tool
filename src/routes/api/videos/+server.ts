import type { RequestHandler } from '@sveltejs/kit';
import { getVideosByCourseId } from '../../../api/controllers/videos';
import { asyncHandler } from '../../../lib/server/errors';
import { validateSearchParams, courseIdQuerySchema } from '../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const generalLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ url }) => {
	const searchParams = url.searchParams;
	const { courseId } = validateSearchParams(courseIdQuerySchema, searchParams);

	const videos = await getVideosByCourseId(courseId);
	return new Response(
		JSON.stringify({ ok: true, data: videos }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(generalLimiter, handler);
