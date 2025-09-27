import { getSupabaseClient } from '../../config/supabase/client.js';

export const getResourcesByCourseIdandType = async (courseId: string, type: string) => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase
		.from('resources')
		.select('*')
		.eq('course_id', courseId)
		.eq('type', type);
	if (error) throw error;
	return data;
};

export const getAllResourcesByCourseId = async (courseId: string) => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.from('resources').select('*').eq('course_id', courseId);
	if (error) throw error;
	return data;
};
