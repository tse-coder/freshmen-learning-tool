import { writable, get, type Writable } from 'svelte/store';
import type { Course, Resource, VideoResource } from '../../types/types';
import { fetchCourses, fetchAllResources, fetchVideos } from '../../api/fetcher';

// Central caches
export const coursesCache: Writable<Course[] | null> = writable(null);
// resourcesCache maps courseId -> Resource[]
export const resourcesCache: Writable<Record<string, Resource[]>> = writable({});
// videosCache maps courseId -> VideoResource[]
export const videosCache: Writable<Record<string, VideoResource[]>> = writable({});

export async function ensureCourses(): Promise<Course[]> {
    const current = get(coursesCache);
    if (current && Array.isArray(current) && current.length > 0) return current;
    const fetched = await fetchCourses();
    coursesCache.set(fetched);
    return fetched;
}

export async function ensureResources(courseId: string): Promise<Resource[]> {
    const map = get(resourcesCache);
    if (map && map[courseId] && Array.isArray(map[courseId]) && map[courseId].length > 0) return map[courseId];
    const fetched = await fetchAllResources(courseId);
    const next = { ...(map || {}) };
    next[courseId] = fetched;
    resourcesCache.set(next);
    return fetched;
}

export async function ensureVideos(courseId: string): Promise<VideoResource[]> {
    const map = get(videosCache);
    if (map && map[courseId] && Array.isArray(map[courseId]) && map[courseId].length > 0) return map[courseId];
    const fetched = await fetchVideos(courseId);
    const next = { ...(map || {}) };
    next[courseId] = fetched;
    videosCache.set(next);
    return fetched;
}

// Convenience: ensure both resources + videos and return merged list (videos mapped to Resource shape)
export async function ensureAllCourseResources(courseId: string): Promise<Resource[]> {
    const [resources, videos] = await Promise.all([ensureResources(courseId), ensureVideos(courseId)]);
    const mappedVideos: Resource[] = (videos || []).map((v) => ({
        id: v.id,
        title: v.title,
        type: 'video',
        url: v.url,
        thumbnail: v.thumbnail || ''
    }));
    // Merge while avoiding duplicates by id
    const combined = [...resources.filter((r) => r && r.id), ...mappedVideos];
    // update resourcesCache with combined list so subsequent reads get merged view
    const resMap = get(resourcesCache) || {};
    resMap[courseId] = combined;
    resourcesCache.set({ ...resMap });
    return combined;
}
