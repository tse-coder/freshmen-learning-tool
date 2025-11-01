import type { RequestHandler } from '@sveltejs/kit';
import { getCourses } from '../../../api/controllers/courses';
import { asyncHandler } from '../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const generalLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async () => {
	const courses = await getCourses();
	return new Response(
		JSON.stringify({ ok: true, data: courses }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(generalLimiter, handler);
