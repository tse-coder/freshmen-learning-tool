import type { RequestHandler } from '@sveltejs/kit';
import { verifyTelegramInitData } from '../../../../lib/server/verifyTelegram';
import { getSupabaseClient } from '../../../../config/supabase/client';
import { asyncHandler } from '../../../../lib/server/errors';
import { validateBody, telegramInitDataSchema } from '../../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';
import { z } from 'zod';
import { ApiError } from '../../../../lib/server/errors';
import { logUserActivity } from '../../../../lib/server/activityLogger';

const supabase = getSupabaseClient();

const loginBodySchema = z.object({
	initData: telegramInitDataSchema
});

const authLimiter = rateLimit(RATE_LIMITS.AUTH);

const handler = asyncHandler(async ({ request }) => {
	const { initData } = await validateBody(loginBodySchema, request);

	// Verify Telegram init data
	const user = verifyTelegramInitData(initData);

	if (!user) {
		throw new ApiError(403, 'Invalid Telegram data', 'UNAUTHORIZED');
	}

	// Upsert user into Supabase
	const { data, error } = await supabase
		.from('users')
		.upsert({
			id: user.id.toString(),
			first_name: user.first_name,
			last_name: user.last_name,
			username: user.username,
			language_code: user.language_code,
			photo_url: user.photo_url,
			last_seen: new Date().toISOString(),
			data: user,
			visits: user.visits ? user.visits + 1 : 1,
		})
		.select()
		.single();

	if (error) {
		throw new ApiError(500, 'Database error', 'DATABASE_ERROR');
	}

	// Log user activity (non-blocking - errors won't affect login)
	logUserActivity(user.id.toString(), '/login', request.headers.get('user-agent') || undefined)
		.catch((err) => console.error('[Login] Failed to log activity:', err));

	return new Response(JSON.stringify({ ok: true, user: data }), {
		headers: { 'Content-Type': 'application/json' }
	});
});

export const POST: RequestHandler = withRateLimit(authLimiter, handler);

