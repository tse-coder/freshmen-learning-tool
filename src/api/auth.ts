// Small client helpers to call serverless auth endpoints.

import { getFetcher, type FetchFn } from './fetcher';

async function postJson(path: string, body: any, fetchFn?: FetchFn) {
	const fetcher = getFetcher(fetchFn);
	const res = await fetcher(`/api${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include', // still useful if you set cookies in your endpoint
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
