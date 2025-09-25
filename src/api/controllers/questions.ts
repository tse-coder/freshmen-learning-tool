import { supabase } from '../../config/supabase/client.js';

export const getExamQuestions = async (examId: string) => {
	const { data: examQuestions, error } = await supabase
		.from('exam_questions')
		.select('*')
		.eq('exam_id', examId);
	if (error) {
		console.error('Error fetching exam questions:', error);
		return [];
	}
	return examQuestions;
};
