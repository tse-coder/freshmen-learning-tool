/**
 * Telegram Web App data verification for serverless functions
 */
import crypto from 'crypto';
import { logger } from './logger';
import { ApiError } from './errors';

const botToken = import.meta.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

if (!botToken) {
	logger.warn('TELEGRAM_BOT_TOKEN not set. Telegram verification will fail.');
}

export function verifyTelegramInitData(initData: string): {
	id: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	photo_url?: string;
	is_premium?: boolean;
	visits?: number;
} | null {
	if (!botToken) {
		throw new ApiError(500, 'Telegram bot token not configured', 'CONFIGURATION_ERROR');
	}

	if (!initData || typeof initData !== 'string') {
		throw new ApiError(400, 'Invalid Telegram init data', 'INVALID_INPUT');
	}

	try {
		const params = new URLSearchParams(initData);
		const data: Record<string, string> = {};
		params.forEach((v, k) => {
			data[k] = v;
		});

		const receivedHash = data.hash;
		if (!receivedHash) {
			throw new ApiError(400, 'Missing hash in Telegram data', 'INVALID_INPUT');
		}

		delete data.hash;

		const checkString = Object.keys(data)
			.sort()
			.map((key) => `${key}=${data[key]}`)
			.join('\n');

		const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

		const hmac = crypto.createHmac('sha256', secretKey).update(checkString).digest('hex');

		if (hmac !== receivedHash) {
			logger.warn('Telegram hash verification failed');
			return null;
		}

		const user = JSON.parse(data.user);
		return user;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		logger.error('Error verifying Telegram data:', error);
		throw new ApiError(400, 'Invalid Telegram data format', 'INVALID_INPUT');
	}
}

