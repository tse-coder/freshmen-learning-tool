import type { RequestHandler } from '@sveltejs/kit';
import { getSupabaseClient } from '../../../config/supabase/client';
import { asyncHandler } from '../../../lib/server/errors';
import { validateBody, feedbackSchema } from '../../../lib/server/validation';
import { rateLimit, RATE_LIMITS, withRateLimit } from '../../../lib/server/rateLimit';
import { ApiError } from '../../../lib/server/errors';

const supabase = getSupabaseClient();

const feedbackLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	maxRequests: 5 // Limit feedback submissions
});

const handler = asyncHandler(async ({ request }) => {
	const { title, message, user_id } = await validateBody(feedbackSchema, request);

	// Insert into the `feedback` table (new thread)
	const { data: feedbackData, error: feedbackError } = await supabase
		.from('feedback')
		.insert({
			user_id,
			title
		})
		.select('id')
		.single();

	if (feedbackError) {
		throw new ApiError(500, 'Failed to create feedback', 'DATABASE_ERROR', feedbackError);
	}

	const feedbackId = feedbackData.id;

	// Insert initial message into `feedback_messages`
	const { error: messageError } = await supabase.from('feedback_messages').insert({
		feedback_id: feedbackId,
		sender_type: 'user',
		message
	});

	if (messageError) {
		throw new ApiError(500, 'Failed to save feedback message', 'DATABASE_ERROR', messageError);
	}

	return new Response(
		JSON.stringify({
			ok: true,
			feedback_id: feedbackId,
			message: 'Feedback recorded successfully'
		}),
		{ headers: { 'Content-Type': 'application/json' } }
	);
});

export const POST: RequestHandler = withRateLimit(feedbackLimiter, handler);
