// @ts-nocheck
import { fail, redirect } from '@sveltejs/kit';
import { setAdminCookie } from '../../../lib/server/admin';
import env from 'dotenv';
env.config();
const adminSecret = process.env.ADMIN_SECRET;

export const load = async () => {
	return {};
};

export const actions = {
	default: async ({ request, cookies, url }: any) => {
		const form = await request.formData();
		const code = String(form.get('code') || '');
		const next = String(form.get('next') || url.searchParams.get('next') || '/admin');
		if (!code) return fail(400, { message: 'Code is required' });
		if (!adminSecret) return fail(500, { message: 'admin secret not configured' });
		if (code !== adminSecret) return fail(401, { message: 'Invalid code' });
		setAdminCookie(cookies, code);
		throw redirect(302, next);
	}
};


