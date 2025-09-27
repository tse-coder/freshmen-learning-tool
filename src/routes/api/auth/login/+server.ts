import type { RequestHandler } from '@sveltejs/kit';
import { verifyTelegramInitData } from '../../../../../backend/utils/verifyTelegram';
import { getSupabaseClient } from '../../../../config/supabase/client';

// Initialize Supabase client with service key (keep it server-side only)
const supabase = getSupabaseClient();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { initData } = await request.json();

		// 1. Verify Telegram init data
		const user = verifyTelegramInitData(initData);

		if (!user) {
			return new Response(JSON.stringify({ ok: false, error: 'Invalid Telegram data' }), {
				status: 403
			});
		}

		// 2. Upsert user into Supabase
		const { data, error } = await supabase
			.from('users')
			.upsert({
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				username: user.username,
				language_code: user.language_code,
				photo_url: user.photo_url,
				last_seen: new Date().toISOString(),
				data: user // full JSON user object for future flexibility
			})
			.select()
			.single();

		if (error) {
			console.error('Supabase upsert error:', error);
			return new Response(JSON.stringify({ ok: false, error: 'Database error' }), {
				status: 500
			});
		}

		// 3. Return user (from DB for consistency)
		return new Response(JSON.stringify({ ok: true, user: data }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('Login error:', err);
		return new Response(JSON.stringify({ ok: false, error: 'Bad request' }), { status: 400 });
	}
};
