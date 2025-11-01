import type { RequestHandler } from '@sveltejs/kit';
import {
	getAllResourcesByCourseId,
	getResourcesByCourseIdandType
} from '../../../api/controllers/resources.js';
import { asyncHandler } from '../../../lib/server/errors';
import { validateSearchParams, resourceQuerySchema } from '../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';

const generalLimiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ url }) => {
	const searchParams = url.searchParams;
	const { courseId, type } = validateSearchParams(resourceQuerySchema, searchParams);

	const data = type
		? await getResourcesByCourseIdandType(courseId, type)
		: await getAllResourcesByCourseId(courseId);

	return new Response(
		JSON.stringify({ ok: true, data }),
		{
			headers: { 'Content-Type': 'application/json' }
		}
	);
});

export const GET: RequestHandler = withRateLimit(generalLimiter, handler);
