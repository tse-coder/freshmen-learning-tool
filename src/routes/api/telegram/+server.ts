// src/routes/api/telegram/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { Telegraf } from 'telegraf';
import 'dotenv/config'

// 1. Initialize the bot instance
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

// --- Bot Command/Event Registration ---
// Handles the /start command
bot.start((ctx) => {
	ctx.reply(
		`Welcome ${ctx.from.first_name}! \n\n Use the miniapp to access the courses`,
		{
			reply_markup: {
				inline_keyboard: [
					[
						{
							text: "Open MiniApp",
							// NOTE: The URL must be the exact WebApp URL you want to open
							web_app: { url: "https://freshmen-learning-tool.vercel.app" },
						},
					],
					[
						{ text: "channel", url: "https://t.me/fresh_hub_channel" },
						{ text: "discuss", url: "https://t.me/+l7AmB_E3RkdjZTE0" },
					],
				],
			},
		}
	);
});

// Add more bot handlers here (e.g., bot.on('text', ...), bot.command('help', ...))

// --- SvelteKit POST Handler ---
// This function executes every time Telegram sends an update to your webhook URL.
export const POST: RequestHandler = async ({ request }) => {
	try {
		// Telegraf provides a webhook-compatible function for handling the raw HTTP request body.
		// We process the incoming JSON payload (the 'update' object from Telegram).
		const update = await request.json();
		await bot.handleUpdate(update);

		// IMPORTANT: Return a 200 OK status immediately to Telegram.
		// The actual reply (e.g., from bot.start) is handled asynchronously by Telegraf
		// making a separate API call back to Telegram.
		return json({ success: true }, { status: 200 });

	} catch (error) {
		console.error('Telegram Webhook processing failed:', error);
		// Log the error but still return 200 to Telegram to prevent retry loops,
		// or return 500 if you want Telegram to retry (less common).
		return json({ error: 'Failed to process update' }, { status: 500 });
	}
};
