import { writable, get, type Writable } from 'svelte/store';
import type { Course, ExamResource, Resource, VideoResource } from '../../types/types';
import {
	fetchCourses,
	fetchAllResources,
	fetchVideos,
	fetchExamsByCourseId
} from '../../api/fetcher';

type FetchFn = typeof fetch;

// Central caches
export const coursesCache: Writable<Course[] | null> = writable(null);
export const resourcesCache: Writable<Record<string, Resource[]>> = writable({});
export const videosCache: Writable<Record<string, VideoResource[]>> = writable({});
export const examsCache: Writable<Record<string, ExamResource[]>> = writable({});

export async function ensureCourses(fetchFn?: FetchFn): Promise<Course[]> {
	const current = get(coursesCache);
	if (current && current.length > 0) return current;

	const fetched = await fetchCourses(fetchFn);
	coursesCache.set(fetched);
	return fetched;
}

export async function ensureResources(courseId: string, fetchFn?: FetchFn): Promise<Resource[]> {
	const map = get(resourcesCache);
	if (map[courseId]?.length > 0) return map[courseId];

	const fetched = await fetchAllResources(courseId, fetchFn);
	resourcesCache.set({ ...map, [courseId]: fetched });
	return fetched;
}

export async function ensureVideos(courseId: string, fetchFn?: FetchFn): Promise<VideoResource[]> {
	const map = get(videosCache);
	if (map[courseId]?.length > 0) return map[courseId];

	const fetched = await fetchVideos(courseId, fetchFn);
	videosCache.set({ ...map, [courseId]: fetched });
	return fetched;
}

export async function ensureAllCourseResources(
	courseId: string,
	fetchFn?: FetchFn
): Promise<Resource[]> {
	const [resources, videos] = await Promise.all([
		ensureResources(courseId, fetchFn),
		ensureVideos(courseId, fetchFn)
	]);

	const mappedVideos: Resource[] = videos.map((v) => ({
		id: v.id,
		title: v.title,
		type: 'video',
		url: v.url,
		thumbnail: v.thumbnail || ''
	}));

	const combined = [...resources.filter((r) => r?.id), ...mappedVideos];
	resourcesCache.set({ ...get(resourcesCache), [courseId]: combined });
	return combined;
}

export async function ensureExams(courseId: string, fetchFn?: FetchFn): Promise<ExamResource[]> {
	const map = get(examsCache);
	if (map[courseId]?.length > 0) return map[courseId];

	const exams = await fetchExamsByCourseId(courseId, fetchFn);
	examsCache.update((current) => ({ ...current, [courseId]: exams }));
	return exams;
}
