import type { Course } from '../types/types';

export type FetchFn = typeof fetch;

/**
 * Helper to always use the right fetch function
 */
export const getFetcher = (fetchFn?: FetchFn) => fetchFn ?? globalThis.fetch;

export const fetchCourses = async (fetchFn?: FetchFn): Promise<Course[]> => {
	try {
		const fetcher = getFetcher(fetchFn);
		const res = await fetcher('/api/courses');
		if (!res.ok) throw new Error('Failed to fetch courses');
		const courses = await res.json();

		const coursesWithCounts: Course[] = await Promise.all(
			courses.map(async (course: { id: string; name: string }) => {
				const [modules, notes, videos] = await Promise.all([
					fetchResources(course.id, 'module', fetcher),
					fetchResources(course.id, 'shortNote', fetcher),
					fetchVideos(course.id, fetcher)
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

export const fetchResources = async (courseId: string, type: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const url = `/api/resources?courseId=${courseId}&type=${type}`;
		const res = await fetcher(url);
		if (!res.ok) throw new Error('Failed to fetch resources');
		return await res.json();
	} catch (error) {
		console.error('Error fetching resources:', error);
		return [];
	}
};

export const fetchAllResources = async (courseId: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const url = `/api/resources?courseId=${courseId}`;
		const res = await fetcher(url);
		if (!res.ok) throw new Error('Failed to fetch resources');
		return await res.json();
	} catch (error) {
		console.error('Error fetching all resources:', error);
		return [];
	}
};

export const fetchVideos = async (courseId: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const url = `/api/videos?courseId=${courseId}`;
		const res = await fetcher(url);
		if (!res.ok) throw new Error('Failed to fetch videos');
		return await res.json();
	} catch (error) {
		console.error('Error fetching videos:', error);
		return [];
	}
};

export const fetchVideoById = async (videoId: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const url = `/api/videos?videoId=${videoId}`;
		const res = await fetcher(url);
		if (!res.ok) throw new Error('Failed to fetch video');
		return await res.json();
	} catch (error) {
		console.error('Error fetching video by id:', error);
		return null;
	}
};

export const fetchExamsByCourseId = async (courseId: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const url = `/api/exams?courseId=${courseId}`;
		const res = await fetcher(url);
		if (!res.ok) throw new Error('Failed to fetch exams');
		return await res.json();
	} catch (error) {
		console.error('Error fetching exams:', error);
		throw error;
	}
};

export const fetchExams = async (fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const res = await fetcher('/api/exams/all');
		if (!res.ok) throw new Error('Failed to fetch exams');
		return await res.json();
	} catch (error) {
		console.error('Error fetching exams:', error);
		throw error;
	}
};

export const fetchQuestionsByExamId = async (examId: string, fetchFn?: FetchFn) => {
	try {
		const fetcher = getFetcher(fetchFn);
		const res = await fetcher(`/api/questions?examId=${examId}`);
		if (!res.ok) throw new Error('Failed to fetch questions');
		return await res.json();
	} catch (error) {
		console.error('Error fetching questions:', error);
		throw error;
	}
};
