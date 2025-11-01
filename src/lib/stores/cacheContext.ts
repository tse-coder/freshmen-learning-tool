import { writable, get, type Writable } from 'svelte/store';
import type { Course, ExamResource, Resource, VideoResource } from '../../types/types';
import {
	fetchCourses,
	fetchAllResources,
	fetchVideos,
	fetchExamsByCourseId
} from '../../api/fetcher';
import { logger } from '../../utils/logger';

type FetchFn = typeof fetch;

// Central caches
export const coursesCache: Writable<Course[] | null> = writable(null);
export const resourcesCache: Writable<Record<string, Resource[]>> = writable({});
export const videosCache: Writable<Record<string, VideoResource[]>> = writable({});
export const examsCache: Writable<Record<string, ExamResource[]>> = writable({});

export async function ensureCourses(fetchFn?: FetchFn): Promise<Course[]> {
	const current = get(coursesCache);
	if (current && current.length > 0) {
		logger.debug('Courses found in cache', { count: current.length });
		return current;
	}

	logger.debug('Fetching courses (not in cache)');
	try {
		const fetched = await fetchCourses(fetchFn);
		logger.info('Courses fetched and cached', { count: fetched.length });
		coursesCache.set(fetched);
		return fetched;
	} catch (error) {
		logger.error('Failed to ensure courses', error);
		throw error;
	}
}

export async function ensureResources(courseId: string, fetchFn?: FetchFn): Promise<Resource[]> {
	const map = get(resourcesCache);
	if (map[courseId]?.length > 0) {
		logger.debug('Resources found in cache', { courseId, count: map[courseId].length });
		return map[courseId];
	}

	logger.debug('Fetching resources (not in cache)', { courseId });
	try {
		const fetched = await fetchAllResources(courseId, fetchFn);
		logger.debug('Resources fetched and cached', { courseId, count: fetched.length });
		resourcesCache.set({ ...map, [courseId]: fetched });
		return fetched;
	} catch (error) {
		logger.error('Failed to ensure resources', { courseId, error });
		throw error;
	}
}

export async function ensureVideos(courseId: string, fetchFn?: FetchFn): Promise<VideoResource[]> {
	const map = get(videosCache);
	if (map[courseId]?.length > 0) {
		logger.debug('Videos found in cache', { courseId, count: map[courseId].length });
		return map[courseId];
	}

	logger.debug('Fetching videos (not in cache)', { courseId });
	try {
		const fetched = await fetchVideos(courseId, fetchFn);
		logger.debug('Videos fetched and cached', { courseId, count: fetched.length });
		videosCache.set({ ...map, [courseId]: fetched });
		return fetched;
	} catch (error) {
		logger.error('Failed to ensure videos', { courseId, error });
		throw error;
	}
}

export async function ensureAllCourseResources(
	courseId: string,
	fetchFn?: FetchFn
): Promise<Resource[]> {
	logger.debug('Ensuring all course resources', { courseId });
	try {
		const [resources, videos] = await Promise.all([
			ensureResources(courseId, fetchFn),
			ensureVideos(courseId, fetchFn)
		]);

		logger.debug('Resources and videos fetched', { 
			courseId, 
			resourcesCount: resources.length, 
			videosCount: videos.length 
		});

		const mappedVideos: Resource[] = videos.map((v) => ({
			id: v.id,
			title: v.title,
			type: 'video',
			url: v.url,
			thumbnail: v.thumbnail || ''
		}));

		const combined = [...resources.filter((r) => r?.id), ...mappedVideos];
		logger.debug('Combined resources', { courseId, totalCount: combined.length });
		resourcesCache.set({ ...get(resourcesCache), [courseId]: combined });
		return combined;
	} catch (error) {
		logger.error('Failed to ensure all course resources', { courseId, error });
		throw error;
	}
}

export async function ensureExams(courseId: string, fetchFn?: FetchFn): Promise<ExamResource[]> {
	const map = get(examsCache);
	if (map[courseId]?.length > 0) {
		logger.debug('Exams found in cache', { courseId, count: map[courseId].length });
		return map[courseId];
	}

	logger.debug('Fetching exams (not in cache)', { courseId });
	try {
		const exams = await fetchExamsByCourseId(courseId, fetchFn);
		logger.debug('Exams fetched and cached', { courseId, count: exams.length });
		examsCache.update((current) => ({ ...current, [courseId]: exams }));
		return exams;
	} catch (error) {
		logger.error('Failed to ensure exams', { courseId, error });
		throw error;
	}
}
