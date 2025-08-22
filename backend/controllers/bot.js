import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

bot.start((ctx) => {
	ctx.reply('Welcome! Click the button below to launch the mini app.', {
		reply_markup: {
			inline_keyboard: [
				[
					{
						text: 'Open Mini App',
						web_app: { url: 'https://freshmen-tool.vercel.app' }
					}
				]
			]
		}
	});
});

bot.launch();

export default bot;
