import { ensureExams } from '$lib/stores/cacheContext';
import { fetchQuestionsByExamId } from '../../../../../api/fetcher';

export const load = async ({ params }: { params: { course: string; id: string } }) => {
	const courseId = decodeURIComponent(params.course);
	const examId = decodeURIComponent(params.id);

	if (!courseId || !examId) {
		throw new Error('Course ID and Exam ID are required');
	}

	try {
		const exams = await ensureExams(courseId);
		const exam = exams.find((exam: { id: string }) => exam.id === examId);

		if (!exam) {
			throw new Error('Exam not found');
		}

		const examQuestions = await fetchQuestionsByExamId(examId);

		return { examQuestions,exam };
	} catch (error) {
		console.error('Error loading exam:', error);
		throw new Error('Failed to load exam');
	}
};
