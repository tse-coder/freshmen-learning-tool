import { redirect } from '@sveltejs/kit';
import { isAdmin } from '../../lib/server/admin';

export const load = async ({ cookies, url }: any) => {
	// Allow login page without admin cookie
	if (url.pathname.startsWith('/admin/login')) {
		return {};
	}
	if (!isAdmin(cookies)) {
		throw redirect(302, `/admin/login?next=${encodeURIComponent(url.pathname)}`);
	}
	return {};
};


