import type { Course } from '../types/types';

export const fetchCourses = async (): Promise<Course[]> => {
	try {
		const res = await fetch('/api/courses');
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
		const url = new URL('/api/resources', window.location.origin);
		url.searchParams.append('courseId', courseId);
		url.searchParams.append('type', type);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch resources');
		return await res.json();
	} catch (error) {
		console.error('Error fetching resources:', error);
		return [];
	}
};

export const fetchAllResources = async (courseId: string) => {
	try {
		const url = new URL('/api/resources', window.location.origin);
		url.searchParams.append('courseId', courseId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch resources');
		return await res.json();
	} catch (error) {
		console.error('Error fetching all resources:', error);
		return [];
	}
};

export const fetchVideos = async (courseId: string) => {
	try {
		const url = new URL('/api/videos', window.location.origin);
		url.searchParams.append('courseId', courseId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch videos');
		return await res.json();
	} catch (error) {
		console.error('Error fetching videos:', error);
		return [];
	}
};

export const fetchVideoById = async (videoId: string) => {
	try {
		const url = new URL('/api/videos', window.location.origin);
		url.searchParams.append('videoId', videoId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch video');
		return await res.json();
	} catch (error) {
		console.error('Error fetching video by id:', error);
		return null;
	}
};

export const fetchExamsByCourseId = async (courseId: string) => {
	try {
		const url = new URL('/api/exams', window.location.origin);
		url.searchParams.append('courseId', courseId);

		const res = await fetch(url.toString());
		if (!res.ok) throw new Error('Failed to fetch exams');

		return await res.json();
	} catch (error) {
		console.error('Error fetching exams:', error);
		throw error;
	}
};

export const fetchExams = async () => {
	try {
		const res = await fetch('/api/exams/all');
		if (!res.ok) throw new Error('Failed to fetch exams');
		return await res.json();
	} catch (error) {
		console.error('Error fetching exams:', error);
		throw error;
	}
};

export const fetchQuestionsByExamId = async (examId: string) => {
	try {
		const res = await fetch(`/api/questions?examId=${examId}`);
		if (!res.ok) throw new Error('Failed to fetch questions');
		return await res.json();
	} catch (error) {
		console.error('Error fetching questions:', error);
		throw error;
	}
};
