import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../config/supabase/client';

const supabase = getSupabaseClient();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { title, message, user_id } = await request.json();

		// Basic validation
		if (!title || typeof title !== 'string' || !title.trim()) {
			return new Response(JSON.stringify({ ok: false, error: 'Title is required' }), {
				status: 400
			});
		}

		if (!message || typeof message !== 'string' || !message.trim()) {
			return new Response(JSON.stringify({ ok: false, error: 'Message is required' }), {
				status: 400
			});
		}

		// Step 1️⃣: Insert into the `feedback` table (new thread)
		const { data: feedbackData, error: feedbackError } = await supabase
			.from('feedback')
			.insert({
				user_id,
				title
			})
			.select('id')
			.single();

		if (feedbackError) throw feedbackError;
		const feedbackId = feedbackData.id;

		// Step 2️⃣: Insert initial message into `feedback_messages`
		const { error: messageError } = await supabase.from('feedback_messages').insert({
			feedback_id: feedbackId,
			sender_type: 'user',
			message
		});

		if (messageError) throw messageError;

		// Step 3️⃣: Success response
		return new Response(
			JSON.stringify({
				ok: true,
				feedback_id: feedbackId,
				message: 'Feedback recorded successfully'
			}),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (err: any) {
		console.error('Feedback submission error:', err);
		return new Response(
			JSON.stringify({ ok: false, error: err.message || 'Internal Server Error' }),
			{ status: 500 }
		);
	}
};
