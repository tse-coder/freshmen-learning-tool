import { supabase } from '../supabase/client.js';

export const getVideosByCourseId = async (courseId) => {
	const { data, error } = await supabase.from('videos').select('*').eq('course_id', courseId);

	if (error) throw error;
	return data;
};

export const getVideoById = async (videoId) => {
	const { data, error } = await supabase.from('videos').select('*').eq('id', videoId).single();

	if (error) throw error;
	return data;
};

export const getVideosByCourseAndTitle = async (courseId, title) => {
	const { data, error } = await supabase
		.from('videos')
		.select('*')
		.eq('course_id', courseId)
		.ilike('title', `%${title}%`);

	if (error) throw error;
	return data;
};
