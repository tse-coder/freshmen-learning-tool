import { supabase } from '../supabase/client.ts';

export const getResourcesByCourseIdandType = async (
	courseId: string,
	type: 'module' | 'exam' | 'quiz' | 'shortNote'
) => {
	const { data, error } = await supabase
		.from('resources')
		.select('*')
		.eq('course_id', courseId)
		.eq('type', type);
	if (error) throw error;
	return data;
};

export const getAllResourcesByCourseId = async (courseId: string) => {
	const { data, error } = await supabase.from('resources').select('*').eq('course_id', courseId);
	if (error) throw error;
	return data
};
