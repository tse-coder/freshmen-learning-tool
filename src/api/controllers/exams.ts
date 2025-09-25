import { supabase } from '../../config/supabase/client.js';
/**
 * Fetch exam data and its questions from Supabase
 * @param {string} examId - The ID of the exam to fetch
 * @returns {Promise<Object>} - The exam data and its questions
 */
async function getExamDataByCourseId(courseId: string) {
	// Fetch exam metadata
	const { data: exam, error: examError } = await supabase
		.from('exams')
		.select('*')
		.eq('course_id', courseId);

	if (examError) {
		throw new Error(`Failed to fetch exam: ${examError.message}`);
	}

	return exam;
}
/**
 * get all exams
 */
async function getAllExams() {
	const { data: exams, error } = await supabase.from('exams').select('*');

	if (error) {
		throw new Error(`Failed to fetch exams: ${error.message}`);
	}

	return exams;
}

export { getExamDataByCourseId, getAllExams };
