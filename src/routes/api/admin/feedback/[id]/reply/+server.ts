import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../../../config/supabase/client';
import { asyncHandler } from '../../../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../../../lib/server/rateLimit';
import { requireAdmin } from '../../../../../../lib/server/admin';

const supabase = getSupabaseClient();
const limiter = rateLimit(RATE_LIMITS.GENERAL);

const handler: RequestHandler = asyncHandler(async ({ cookies, params, request }) => {
	requireAdmin(cookies);
	const id = params.id as string;
	const body = await request.json().catch(() => ({}));
	const message = String(body.message || '').trim();
	if (!message) {
		return new Response(JSON.stringify({ ok: false, error: 'Message required' }), {
			headers: { 'Content-Type': 'application/json' },
			status: 400
		});
	}
	const { error } = await supabase.from('feedback_messages').insert({
		feedback_id: id,
		sender_type: 'admin',
		message
	});
	if (error) {
		return new Response(JSON.stringify({ ok: false, error: 'Failed to send message' }), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
	return new Response(JSON.stringify({ ok: true }), {
		headers: { 'Content-Type': 'application/json' }
	});
});

export const POST = withRateLimit(limiter, handler);



