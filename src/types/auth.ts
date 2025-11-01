/**
 * Authentication-related type definitions
 */

export interface TelegramUser {
	id: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	photo_url?: string;
	is_premium?: boolean;
}

export interface AuthUser {
	id: string | number;
	first_name?: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	photo_url?: string;
	data?: TelegramUser;
	last_seen?: string;
}

export interface AuthResponse {
	ok: boolean;
	user?: AuthUser | null;
	error?: string;
}

