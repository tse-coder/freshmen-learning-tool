import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(token);

bot.start((ctx) => {
	ctx.reply(`Welcome <b><strong>${ctx.from.first_name}</strong></b>!`);
});

bot.launch();

export default bot;
