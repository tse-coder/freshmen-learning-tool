import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../config/supabase/client';

const supabase = getSupabaseClient();
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { feedback, user_id } = await request.json();

		if (!feedback || typeof feedback !== 'string') {
			return new Response(JSON.stringify({ ok: false, error: 'Invalid feedback' }), {
				status: 400
			});
		}
		const userId = user_id ?? null;

		const { error } = await supabase.from('feedback').insert([
			{
				user_id: userId,
				feedback
			}
		]);

		if (error) throw error;

		return new Response(JSON.stringify({ ok: true }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		return new Response(JSON.stringify({ ok: false, error: err.message }), {
			status: 500
		});
	}
};
