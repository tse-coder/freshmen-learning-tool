import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../../config/supabase/client';
import { asyncHandler } from '../../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../../lib/server/rateLimit';
import { requireAdmin } from '../../../../../lib/server/admin';

const supabase = getSupabaseClient();
const limiter = rateLimit(RATE_LIMITS.GENERAL);

const handler: RequestHandler = asyncHandler(async ({ cookies, params }) => {
	requireAdmin(cookies);
	const id = params.id as string;
	const [{ data: thread }, { data: messages }] = await Promise.all([
		supabase.from('feedback').select('*').eq('id', id).single(),
		supabase
			.from('feedback_messages')
			.select('id, feedback_id, sender_type, message, created_at')
			.eq('feedback_id', id)
			.order('created_at', { ascending: true })
	]);
	return new Response(JSON.stringify({ ok: true, data: { thread, messages } }), {
		headers: { 'Content-Type': 'application/json' }
	});
});

export const GET = withRateLimit(limiter, handler);



