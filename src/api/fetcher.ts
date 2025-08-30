import { SERVER_URL } from '../config/env';
import type { Course } from '../types/types';
console.log(SERVER_URL);
export const fetchCourses = async (): Promise<Course[]> => {
	try {
		const res = await fetch(`${SERVER_URL}/courses`);
		if (!res.ok) throw new Error('Failed to fetch courses');
		const courses = await res.json();

		const coursesWithCounts: Course[] = await Promise.all(
			courses.map(async (course: { id: string; name: string }) => {
				const [modules, notes, videos] = await Promise.all([
					fetchResources(course.id, 'module'),
					fetchResources(course.id, 'shortNote'),
					fetchVideos(course.id)
				]);

				return {
					id: course.id,
					name: course.name,
					modules: modules.length,
					notes: notes.length,
					videos: videos.length
				};
			})
		);

		return coursesWithCounts;
	} catch (error) {
		console.error('Error fetching courses with resource counts:', error);
		throw error;
	}
};

export const fetchResources = async (courseId: string, type: string) => {
	try {
		const url = new URL(`${SERVER_URL}/resources`);
		url.searchParams.append('courseId', courseId);
		url.searchParams.append('type', type);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch resources');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching resources:', error);
		return [];
	}
};

export const fetchAllResources = async (courseId: string) => {
	try {
		const url = new URL(`${SERVER_URL}/resources`);
		url.searchParams.append('courseId', courseId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch resources');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching all resources:', error);
		return [];
	}
};

export const fetchVideos = async (courseId: string) => {
	try {
		const url = new URL(`${SERVER_URL}/videos`);
		url.searchParams.append('courseId', courseId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch videos');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching videos:', error);
		return [];
	}
};

export const fetchVideoById = async (videoId: string) => {
	try {
		const url = new URL(`${SERVER_URL}/videos`);
		url.searchParams.append('videoId', videoId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch video');
		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching video by id:', error);
		return null;
	}
};
