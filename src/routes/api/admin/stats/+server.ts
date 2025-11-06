import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../config/supabase/client';
import { asyncHandler } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';
import { requireAdmin } from '../../../../lib/server/admin';

const supabase = getSupabaseClient();
const limiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ cookies, url }) => {
	requireAdmin(cookies);

	const [usersCount, coursesCount, examsCount, resourcesCount, feedbackCount, messagesCount] = await Promise.all([
		supabase.from('users').select('id', { count: 'exact', head: true }),
		supabase.from('courses').select('id', { count: 'exact', head: true }),
		supabase.from('exams').select('id', { count: 'exact', head: true }),
		supabase.from('resources').select('id', { count: 'exact', head: true }),
		supabase.from('feedback').select('id', { count: 'exact', head: true }),
		supabase.from('feedback_messages').select('id', { count: 'exact', head: true })
	]);

	// Range-based timeseries for new users
	const range = (url.searchParams.get('range') || 'week').toLowerCase();
	const now = new Date();
	let since = new Date(now);
	let buckets: { key: string; label: string }[] = [];
	let interval: 'minute' | 'day' | 'month' = 'day';

	if (range === 'hour') {
		// last 60 minutes
		since = new Date(now.getTime() - 60 * 60 * 1000);
		interval = 'minute';
		for (let i = 60; i >= 0; i--) {
			const d = new Date(now.getTime() - i * 60 * 1000);
			const key = d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
			buckets.push({ key, label: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}` });
		}
	} else if (range === 'month') {
		// last 30 days
		since = new Date(now);
		since.setDate(now.getDate() - 29);
		interval = 'day';
		for (let i = 0; i < 30; i++) {
			const d = new Date(since);
			d.setDate(since.getDate() + i);
			const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
			buckets.push({ key, label: key });
		}
	} else if (range === 'year') {
		// last 12 months
		since = new Date(now);
		since.setMonth(now.getMonth() - 11);
		interval = 'month';
		for (let i = 0; i < 12; i++) {
			const d = new Date(since);
			d.setMonth(since.getMonth() + i);
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
			buckets.push({ key, label: key });
		}
	} else {
		// default: week (last 7 days)
		since = new Date(now);
		since.setDate(now.getDate() - 6);
		interval = 'day';
		for (let i = 0; i < 7; i++) {
			const d = new Date(since);
			d.setDate(since.getDate() + i);
			const key = d.toISOString().slice(0, 10);
			buckets.push({ key, label: key });
		}
	}

	const { data: recentUsers } = await supabase
		.from('users')
		.select('id, last_seen')
		.not('last_seen', 'is', null)
		.gte('last_seen', since.toISOString())
		.order('last_seen', { ascending: true });

	const countsByKey: Record<string, number> = {};
	(recentUsers ?? []).forEach((u) => {
		if (!u.last_seen) return;
		const seen = new Date(String(u.last_seen));
		let key = '';
		if (interval === 'minute') key = seen.toISOString().slice(0, 16);
		else if (interval === 'month') key = `${seen.getFullYear()}-${String(seen.getMonth() + 1).padStart(2, '0')}`;
		else key = seen.toISOString().slice(0, 10);
		countsByKey[key] = (countsByKey[key] || 0) + 1;
	});

	const series = buckets.map((b) => ({ x: b.label, y: countsByKey[b.key] || 0 }));

	return new Response(
		JSON.stringify({
			ok: true,
			data: {
				counts: {
					users: usersCount.count ?? 0,
					courses: coursesCount.count ?? 0,
					exams: examsCount.count ?? 0,
					resources: resourcesCount.count ?? 0,
					feedback: feedbackCount.count ?? 0,
					feedback_messages: messagesCount.count ?? 0
				},
				series,
				interval
			}
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
});

export const GET: RequestHandler = withRateLimit(limiter, handler);


