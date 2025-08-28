// src/api/auth.ts
// Small client helpers to call backend auth endpoints.
const BASE = import.meta.env.VITE_BACKEND_URL ?? '';

async function postJson(path: string, body: any) {
	const res = await fetch(`${BASE}${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(body)
	});
	const data = await res.json().catch(() => ({}));
	return { ok: res.ok, status: res.status, data };
}

export async function signInWithTelegram(initData: string) {
	return postJson('/auth/login', { initData });
}

export async function signUpWithTelegram(initData: string) {
	return postJson('/auth/signup', { initData });
}

export async function signInWithCredentials(username: string, password: string) {
	return postJson('/auth/login', { username, password });
}

export async function signUpWithCredentials(username: string, password: string) {
	return postJson('/auth/signup', { username, password });
}
