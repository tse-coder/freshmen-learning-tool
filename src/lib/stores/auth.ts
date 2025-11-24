import { writable, type Writable } from 'svelte/store';
import * as api from '../../api/auth';
import type { AuthUser, AuthResponse } from '../../types/auth';

export const isAuthenticated: Writable<boolean> = writable(false);
export const authUser: Writable<AuthUser | null> = writable(null);

// export function loginDemo(user: { username?: string } = {}) {
// 	authUser.set(user);
// 	isAuthenticated.set(true);
// }

export function logout(): void {
	// Clear local auth state
	// Note: Serverless API routes handle session cleanup server-side
	authUser.set(null);
	isAuthenticated.set(false);
}

export function setAuthenticatedFromTelegram(user: AuthUser): void {
	// user is the object from Telegram.WebApp.initDataUnsafe.user
	authUser.set(user);
	isAuthenticated.set(true);
}

export async function loginWithBackend(username: string, password: string): Promise<AuthResponse> {
	const res = await api.signInWithCredentials(username, password);
	if (res.ok) {
		authUser.set(res.data.user ?? ({ username } as AuthUser));
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user ?? undefined };
	}
	return { ok: false, error: res.data?.error ?? 'Login failed' };
}

export async function signupWithBackend(username: string, password: string): Promise<AuthResponse> {
	const res = await api.signUpWithCredentials(username, password);
	if (res.ok) {
		authUser.set(res.data.user ?? ({ username } as AuthUser));
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user ?? undefined };
	}
	return { ok: false, error: res.data?.error ?? 'Signup failed' };
}

export async function loginWithTelegramInit(initData: string): Promise<AuthResponse> {
	const res = await api.signInWithTelegram(initData);
	if (res.ok) {
		authUser.set(res.data.user ?? null);
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user ?? undefined };
	}
	return { ok: false, error: res.data?.error ?? 'Telegram login failed' };
}

export async function signupWithTelegramInit(initData: string): Promise<AuthResponse> {
	const res = await api.signUpWithTelegram(initData);
	if (res.ok) {
		authUser.set(res.data.user ?? null);
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user ?? undefined };
	}
	return { ok: false, error: res.data?.error ?? 'Telegram signup failed' };
}
