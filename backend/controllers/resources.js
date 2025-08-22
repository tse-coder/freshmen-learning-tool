import { supabase } from '../supabase/client.js';

export const getResourcesByCourseIdandType = async (courseId, type) => {
	const { data, error } = await supabase
		.from('resources')
		.select('*')
		.eq('course_id', courseId)
		.eq('type', type);
	if (error) throw error;
	return data;
};

export const getAllResourcesByCourseId = async (courseId) => {
	const { data, error } = await supabase.from('resources').select('*').eq('course_id', courseId);
	if (error) throw error;
	return data;
};
