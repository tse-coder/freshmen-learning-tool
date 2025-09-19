import { supabase } from "../supabase/client.js";
/**
 * Fetch exam data and its questions from Supabase
 * @param {string} examId - The ID of the exam to fetch
 * @returns {Promise<Object>} - The exam data and its questions
 */
async function getExamDataByCourseId(courseId) {
  // Fetch exam metadata
  const { data: exam, error: examError } = await supabase
    .from('exams')
    .select('*')
    .eq('course_id', courseId)
    .single();

  if (examError) {
    throw new Error(`Failed to fetch exam: ${examError.message}`);
  }

  // Fetch questions for the exam
  const { data: questions, error: questionsError } = await supabase
    .from('exam_questions')
    .select('*')
    .eq('exam_id', examId);

  if (questionsError) {
    throw new Error(`Failed to fetch questions: ${questionsError.message}`);
  }

  return { exam, questions };
}
/**
 * get all exams
 */
async function getAllExams() {
  const { data: exams, error } = await supabase
    .from('exams')
    .select('*');

  if (error) {
    throw new Error(`Failed to fetch exams: ${error.message}`);
  }

  return exams;
}

export { getExamData, getAllExams };
