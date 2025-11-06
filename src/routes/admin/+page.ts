export const load = async ({ fetch }: any) => {
	const [statsRes, usersRes, threadsRes] = await Promise.all([
		fetch('/api/admin/stats?range=week').then((r: Response) => r.json()).catch(() => ({ ok: false })),
		fetch('/api/admin/users?page=1&pageSize=20').then((r: Response) => r.json()).catch(() => ({ ok: false })),
		fetch('/api/admin/feedback').then((r: Response) => r.json()).catch(() => ({ ok: false }))
	]);

	return {
		stats: statsRes?.data ?? { counts: {}, series: [], interval: 'day' },
		usersPage: usersRes?.data ?? { items: [], total: 0, page: 1, pageSize: 20 },
		threads: threadsRes?.data ?? []
	};
};


