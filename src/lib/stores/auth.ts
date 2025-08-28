import { writable, type Writable } from 'svelte/store';
import * as api from '../../api/auth';

export const isAuthenticated: Writable<boolean> = writable(false);
export const authUser: Writable<any | null> = writable(null);

export function loginDemo(user: { username?: string } = {}) {
	authUser.set(user);
	isAuthenticated.set(true);
}

export function logout() {
	// Call backend logout if available (best-effort)
	try {
		fetch((import.meta.env.VITE_BACKEND_URL ?? '') + '/auth/logout', {
			method: 'POST',
			credentials: 'include'
		});
	} catch (e) {
		// ignore
	}
	authUser.set(null);
	isAuthenticated.set(false);
}

export function setAuthenticatedFromTelegram(user: any) {
	// user is the object from Telegram.WebApp.initDataUnsafe.user
	authUser.set(user);
	isAuthenticated.set(true);
}

export async function loginWithBackend(username: string, password: string) {
	const res = await api.signInWithCredentials(username, password);
	if (res.ok) {
		authUser.set(res.data.user ?? { username });
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user };
	}
	return { ok: false, error: res.data?.error ?? 'Login failed' };
}

export async function signupWithBackend(username: string, password: string) {
	const res = await api.signUpWithCredentials(username, password);
	if (res.ok) {
		authUser.set(res.data.user ?? { username });
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user };
	}
	return { ok: false, error: res.data?.error ?? 'Signup failed' };
}

export async function loginWithTelegramInit(initData: string) {
	const res = await api.signInWithTelegram(initData);
	if (res.ok) {
		authUser.set(res.data.user ?? null);
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user };
	}
	return { ok: false, error: res.data?.error ?? 'Telegram login failed' };
}

export async function signupWithTelegramInit(initData: string) {
	const res = await api.signUpWithTelegram(initData);
	if (res.ok) {
		authUser.set(res.data.user ?? null);
		isAuthenticated.set(true);
		return { ok: true, user: res.data.user };
	}
	return { ok: false, error: res.data?.error ?? 'Telegram signup failed' };
}
