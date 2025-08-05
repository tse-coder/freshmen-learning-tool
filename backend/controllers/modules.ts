import { supabase } from '../supabase/client.ts';

export const getModulesByCourseId = async (courseId: string) => {
	const { data, error } = await supabase.from('modules').select('*').eq('course_id', courseId);
	if (error) throw error;
	return data;
};
