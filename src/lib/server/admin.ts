import type { Cookies } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';

const ADMIN_COOKIE = 'admin_token';

export function isAdmin(cookies: Cookies): boolean {
	const token = cookies.get(ADMIN_COOKIE);
	return Boolean(token && env.ADMIN_SECRET && token === env.ADMIN_SECRET);
}

export function requireAdmin(cookies: Cookies) {
	if (!isAdmin(cookies)) {
		throw new Error('UNAUTHORIZED_ADMIN');
	}
}

export function setAdminCookie(cookies: Cookies, value: string) {
	cookies.set(ADMIN_COOKIE, value, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 60 * 60 * 8 // 8 hours
	});
}

export function clearAdminCookie(cookies: Cookies) {
	cookies.delete(ADMIN_COOKIE, { path: '/' });
}


