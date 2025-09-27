import { getSupabaseClient } from '../../config/supabase/client.js';

export const getVideosByCourseId = async (courseId: string) => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.from('videos').select('*').eq('course_id', courseId);

	if (error) throw error;
	return data;
};

export const getVideoById = async (videoId: string) => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).single();

	if (error) throw error;
	return data;
};

export const getVideosByCourseAndTitle = async (courseId: string, title: string) => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase
		.from('videos')
		.select('*')
		.eq('course_id', courseId)
		.ilike('title', `%${title}%`);

	if (error) throw error;
	return data;
};
