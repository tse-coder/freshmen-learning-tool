import type { VideoResource } from '../../../../../types/types';
import type { PageLoad } from './$types';
import { ensureVideos } from '../../../../../lib/stores/cacheContext';

function extractYouTubeId(url: string | undefined) {
	if (!url) return '';
	try {
		// common embed format
		if (url.includes('/embed/')) return url.split('/embed/')[1].split(/[?&]/)[0];
		// watch?v= format
		const v = url.match(/[?&]v=([^&]+)/);
		if (v && v[1]) return v[1];
		// youtu.be short link
		const m = url.match(/youtu\.be\/(.+)$/);
		if (m && m[1]) return m[1].split(/[?&]/)[0];
		// last path segment fallback
		const parts = url.split('/');
		return parts[parts.length - 1].split(/[?&]/)[0];
	} catch (e) {
		return '';
	}
}

export const load: PageLoad = async ({ params, fetch }) => {
	const vidIdParam = params.id;
	const vidCourse = params.course;

	try {
		// ✅ pass event.fetch down
		const videos: VideoResource[] = await ensureVideos(String(vidCourse), fetch);

		const video = videos.find((v) => String(v.id) === String(vidIdParam));
		const ytId = extractYouTubeId(video?.url);

		return {
			videoId: ytId,
			title: video?.title ?? 'Video',
			relatedVideos: videos.filter((v) => String(v.id) !== String(vidIdParam))
		};
	} catch (err) {
		console.error('Failed to load videos for course:', err);
		return {
			videoId: '',
			title: 'Video not available',
			relatedVideos: []
		};
	}
};
