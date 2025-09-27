import { ensureExams } from '$lib/stores/cacheContext';
import { fetchQuestionsByExamId } from '../../../../../api/fetcher';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const courseId = decodeURIComponent(params.course);
	const examId = decodeURIComponent(params.id);

	if (!courseId || !examId) {
		throw new Error('Course ID and Exam ID are required');
	}

	try {
		// ✅ use event.fetch
		const exams = await ensureExams(courseId, fetch);
		const exam = exams.find((exam) => exam.id === examId);

		if (!exam) {
			throw new Error('Exam not found');
		}

		// ✅ pass event.fetch here too
		const examQuestions = await fetchQuestionsByExamId(examId, fetch);

		return { examQuestions, exam };
	} catch (error) {
		console.error('Error loading exam:', error);
		throw new Error('Failed to load exam');
	}
};
