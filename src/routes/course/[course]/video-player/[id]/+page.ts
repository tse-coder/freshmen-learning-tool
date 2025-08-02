import { resources, type VideoResource } from '$lib/data/resources';
import type { LoadEvent } from '@sveltejs/kit';

export function load({ params }: LoadEvent) {
	const vidIdParam = params.id;
	const vidCourse = params.course;
	const courseVideos = resources[vidCourse]?.videos;
	const video = courseVideos?.find((v: VideoResource) => v.id.toString() === vidIdParam);
	const ytId = video.url.split('/embed/')[1];

	return {
		videoId: ytId,
		title: video.title,
		relatedVideos: courseVideos.filter((v) => v.id.toString() !== vidIdParam)
	};
}
