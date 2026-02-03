// src/lib/server/telegram.ts
import { Telegraf } from 'telegraf';
import { logger } from './logger';
import { getSupabaseClient } from '../../config/supabase/client';

const botToken = import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || '';

if (!botToken) {
    logger.warn('TELEGRAM_BOT_TOKEN not configured');
}

export const bot = new Telegraf(botToken);

/**
 * Broadcast a message to a list of users
 * @param message The HTML message to send
 * @param users array of user IDs
 * @returns stats about success/failure
 */
export async function broadcastMessage(message: string, userIds: string[]) {
    let success = 0;
    let failed = 0;
    let errors: any[] = [];

    // Telegram rate limits: 30 messages per second.
    // We'll be conservative and process in batches with delay.
    const BATCH_SIZE = 20;
    const DELAY_MS = 1000;

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
        const batch = userIds.slice(i, i + BATCH_SIZE);

        await Promise.all(
            batch.map(async (userId) => {
                try {
                    await bot.telegram.sendMessage(userId, message, { parse_mode: 'HTML' });
                    success++;
                } catch (err: any) {
                    failed++;
                    if (err.description) {
                        // Only log unique error descriptions to avoid spamming logs
                        if (!errors.some(e => e.error === err.description)) {
                            errors.push({ userId, error: err.description });
                        }
                    }

                    // If user blocked the bot (Forbidden), we might want to flag them in DB
                    // but for now we just skip.
                }
            })
        );

        if (i + BATCH_SIZE < userIds.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    return { success, failed, errors };
}
