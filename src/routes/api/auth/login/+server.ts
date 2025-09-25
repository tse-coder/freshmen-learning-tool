import type { RequestHandler } from '@sveltejs/kit';
import { verifyTelegramInitData } from '../../../../../backend/utils/verifyTelegram';

// POST /api/auth/login
export const POST: RequestHandler = async ({ request }) => {
	try {
		const { initData } = await request.json();

		const user = verifyTelegramInitData(initData);

		if (!user) {
			return new Response(JSON.stringify({ ok: false, error: 'Invalid Telegram data' }), {
				status: 403
			});
		}

		// TODO: Check if user exists in DB and return session/JWT
		return new Response(JSON.stringify({ ok: true, user }), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		return new Response(JSON.stringify({ ok: false, error: 'Bad request' }), { status: 400 });
	}
};
