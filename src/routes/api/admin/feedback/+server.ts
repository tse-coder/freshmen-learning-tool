import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../config/supabase/client';
import { asyncHandler } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';
import { requireAdmin } from '../../../../lib/server/admin';

const supabase = getSupabaseClient();
const limiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ cookies, url }) => {
	requireAdmin(cookies);

	const limit = Number(url.searchParams.get('limit') ?? '50');

	const { data: threads } = await supabase
		.from('feedback')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit);

	const ids = (threads ?? []).map((t) => t.id);
	let latestById: Record<string, any> = {};
	if (ids.length) {
		const { data: msgs } = await supabase
			.from('feedback_messages')
			.select('id, feedback_id, sender_type, message, created_at')
			.in('feedback_id', ids)
			.order('created_at', { ascending: false });
		for (const m of msgs ?? []) {
			if (!latestById[m.feedback_id]) latestById[m.feedback_id] = m;
		}
	}

	return new Response(
		JSON.stringify({
			ok: true,
			data: (threads ?? []).map((t) => ({
				...t,
				latest_message: latestById[t.id] ?? null
			}))
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
});

export const GET: RequestHandler = withRateLimit(limiter, handler);



