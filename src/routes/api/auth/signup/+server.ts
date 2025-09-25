import type { RequestHandler } from '@sveltejs/kit';
import { verifyTelegramInitData } from '../../../../../backend/utils/verifyTelegram';

// POST /api/auth/signup
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { initData } = await request.json();

		const user = verifyTelegramInitData(initData);

		if (!user) {
			return new Response(JSON.stringify({ ok: false, error: 'Invalid Telegram data' }), {
				status: 403
			});
		}

		// TODO: Save user to DB if not exists, return session/JWT
		return new Response(JSON.stringify({ ok: true, user }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ ok: false, error: 'Bad request' }), { status: 400 });
	}
};
