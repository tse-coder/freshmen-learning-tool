import type { Course } from '../types/types';
import { logger } from '../utils/logger';

export type FetchFn = typeof fetch;

/**
 * Helper to always use the right fetch function
 */
export const getFetcher = (fetchFn?: FetchFn) => fetchFn ?? globalThis.fetch;

/**
 * Parse API response with standardized format { ok: boolean, data?: T, error?: string }
 */
function parseApiResponse<T>(response: Response, endpoint: string): Promise<T> {
	return response.json().then((json) => {
		if (json.ok && json.data !== undefined) {
			logger.debug(`API success: ${endpoint}`, { dataLength: Array.isArray(json.data) ? json.data.length : 'non-array' });
			return json.data as T;
		} else {
			const error = json.error || 'Unknown error';
			const code = json.code || 'UNKNOWN_ERROR';
			logger.error(`API error: ${endpoint}`, { error, code, status: response.status });
			throw new Error(`${error} (${code})`);
		}
	}).catch((error) => {
		logger.error(`Failed to parse response from ${endpoint}`, error);
		throw error;
	});
}

export const fetchCourses = async (fetchFn?: FetchFn): Promise<Course[]> => {
	const fetcher = getFetcher(fetchFn);
	const endpoint = '/api/courses';
	
	try {
		logger.debug('Fetching courses', { endpoint });
		const res = await fetcher(endpoint);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching courses`, { 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			throw new Error(`Failed to fetch courses: HTTP ${res.status} ${res.statusText}`);
		}

		const courses = await parseApiResponse<Array<{ id: string; name: string }>>(res, endpoint);
		
		if (!Array.isArray(courses)) {
			logger.error('Courses API returned non-array data', { courses });
			throw new Error('Invalid response format: courses is not an array');
		}

		logger.debug(`Fetched ${courses.length} courses, now fetching resource counts`);
		
		const coursesWithCounts: Course[] = await Promise.all(
			courses.map(async (course: { id: string; name: string }) => {
				try {
					logger.debug(`Fetching resources for course: ${course.name} (${course.id})`);
					const [modules, notes, videos] = await Promise.all([
						fetchResources(course.id, 'module', fetcher),
						fetchResources(course.id, 'shortNote', fetcher),
						fetchVideos(course.id, fetcher)
					]);

					const result = {
						id: course.id,
						name: course.name,
						modules: Array.isArray(modules) ? modules.length : 0,
						notes: Array.isArray(notes) ? notes.length : 0,
						videos: Array.isArray(videos) ? videos.length : 0
					};
					
					logger.debug(`Course counts for ${course.name}`, result);
					return result;
				} catch (error) {
					logger.error(`Failed to fetch resource counts for course ${course.name}`, error);
					// Return course with zero counts if resource fetching fails
					return {
						id: course.id,
						name: course.name,
						modules: 0,
						notes: 0,
						videos: 0
					};
				}
			})
		);

		logger.info(`Successfully fetched ${coursesWithCounts.length} courses with resource counts`);
		return coursesWithCounts;
	} catch (error) {
		logger.error('Error fetching courses with resource counts', error);
		throw error instanceof Error ? error : new Error('Failed to fetch courses with resource counts');
	}
};

export const fetchResources = async (courseId: string, type: string, fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/resources?courseId=${courseId}&type=${type}`;
	
	try {
		logger.debug('Fetching resources', { courseId, type, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching resources`, { 
				courseId, 
				type, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			return [];
		}

		const resources = await parseApiResponse<any[]>(res, url);
		logger.debug(`Fetched ${Array.isArray(resources) ? resources.length : 0} resources`, { courseId, type });
		return Array.isArray(resources) ? resources : [];
	} catch (error) {
		logger.error('Error fetching resources', { courseId, type, error });
		return [];
	}
};

export const fetchAllResources = async (courseId: string, fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/resources?courseId=${courseId}`;
	
	try {
		logger.debug('Fetching all resources', { courseId, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching all resources`, { 
				courseId, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			return [];
		}

		const resources = await parseApiResponse<any[]>(res, url);
		logger.debug(`Fetched ${Array.isArray(resources) ? resources.length : 0} resources`, { courseId });
		return Array.isArray(resources) ? resources : [];
	} catch (error) {
		logger.error('Error fetching all resources', { courseId, error });
		return [];
	}
};

export const fetchVideos = async (courseId: string, fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/videos?courseId=${courseId}`;
	
	try {
		logger.debug('Fetching videos', { courseId, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching videos`, { 
				courseId, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			return [];
		}

		const videos = await parseApiResponse<any[]>(res, url);
		logger.debug(`Fetched ${Array.isArray(videos) ? videos.length : 0} videos`, { courseId });
		return Array.isArray(videos) ? videos : [];
	} catch (error) {
		logger.error('Error fetching videos', { courseId, error });
		return [];
	}
};

export const fetchVideoById = async (videoId: string, fetchFn?: FetchFn): Promise<any | null> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/videos?videoId=${videoId}`;
	
	try {
		logger.debug('Fetching video by ID', { videoId, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching video by ID`, { 
				videoId, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			return null;
		}

		const video = await parseApiResponse<any>(res, url);
		logger.debug('Fetched video', { videoId, hasVideo: !!video });
		return video;
	} catch (error) {
		logger.error('Error fetching video by id', { videoId, error });
		return null;
	}
};

export const fetchExamsByCourseId = async (courseId: string, fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/exams?courseId=${courseId}`;
	
	try {
		logger.debug('Fetching exams by course ID', { courseId, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching exams`, { 
				courseId, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			throw new Error(`Failed to fetch exams: HTTP ${res.status} ${res.statusText}`);
		}

		const exams = await parseApiResponse<any[]>(res, url);
		logger.debug(`Fetched ${Array.isArray(exams) ? exams.length : 0} exams`, { courseId });
		return Array.isArray(exams) ? exams : [];
	} catch (error) {
		logger.error('Error fetching exams by course ID', { courseId, error });
		throw error instanceof Error ? error : new Error('Failed to fetch exams');
	}
};

export const fetchExams = async (fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const endpoint = '/api/exams/all';
	
	try {
		logger.debug('Fetching all exams', { endpoint });
		const res = await fetcher(endpoint);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching all exams`, { 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			throw new Error(`Failed to fetch exams: HTTP ${res.status} ${res.statusText}`);
		}

		const exams = await parseApiResponse<any[]>(res, endpoint);
		logger.debug(`Fetched ${Array.isArray(exams) ? exams.length : 0} exams`);
		return Array.isArray(exams) ? exams : [];
	} catch (error) {
		logger.error('Error fetching all exams', error);
		throw error instanceof Error ? error : new Error('Failed to fetch exams');
	}
};

export const fetchQuestionsByExamId = async (examId: string, fetchFn?: FetchFn): Promise<any[]> => {
	const fetcher = getFetcher(fetchFn);
	const url = `/api/questions?examId=${examId}`;
	
	try {
		logger.debug('Fetching questions by exam ID', { examId, url });
		const res = await fetcher(url);
		
		if (!res.ok) {
			const errorText = await res.text().catch(() => 'Unable to read error');
			logger.error(`HTTP error fetching questions`, { 
				examId, 
				status: res.status, 
				statusText: res.statusText,
				errorText 
			});
			throw new Error(`Failed to fetch questions: HTTP ${res.status} ${res.statusText}`);
		}

		const questions = await parseApiResponse<any[]>(res, url);
		logger.debug(`Fetched ${Array.isArray(questions) ? questions.length : 0} questions`, { examId });
		return Array.isArray(questions) ? questions : [];
	} catch (error) {
		logger.error('Error fetching questions by exam ID', { examId, error });
		throw error instanceof Error ? error : new Error('Failed to fetch questions');
	}
};
