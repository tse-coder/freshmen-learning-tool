import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../../config/supabase/client';
import { asyncHandler } from '../../../../lib/server/errors';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../../lib/server/rateLimit';
import { requireAdmin } from '../../../../lib/server/admin';

const supabase = getSupabaseClient();
const limiter = rateLimit(RATE_LIMITS.GENERAL);

const handler = asyncHandler(async ({ cookies, url }) => {
  requireAdmin(cookies);

  const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get('pageSize') ?? '20')));
  const q = (url.searchParams.get('q') ?? '').trim();

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('users').select('*', { count: 'exact' }).order('last_seen', { ascending: false });

  if (q) {
    // search by first_name, last_name, username, or id
    const like = `%${q}%`;
    query = query.or(`first_name.ilike.${like},last_name.ilike.${like},username.ilike.${like},id.ilike.${like}`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: 'Failed to fetch users' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }

  return new Response(JSON.stringify({ ok: true, data: { items: data ?? [], total: count ?? 0, page, pageSize } }), {
    headers: { 'Content-Type': 'application/json' }
  });
});

export const GET: RequestHandler = withRateLimit(limiter, handler);


