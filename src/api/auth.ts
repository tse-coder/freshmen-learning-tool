// src/lib/auth.js

export async function signIn() {
	const tg = window.Telegram?.WebApp;
	if (!tg) throw new Error('Telegram WebApp not available');

	const res = await fetch('https://your-backend.com/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ initData: tg.initData })
	});

	if (!res.ok) throw new Error('Login failed');
	return await res.json();
}

export async function signUp() {
	const tg = window.Telegram?.WebApp;
	if (!tg) throw new Error('Telegram WebApp not available');

	const res = await fetch('https://your-backend.com/auth/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ initData: tg.initData })
	});

	if (!res.ok) throw new Error('Signup failed');
	return await res.json();
}
