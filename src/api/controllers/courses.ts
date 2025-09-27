import { getSupabaseClient } from '../../config/supabase/client.js';

export const getCourses = async () => {
	const supabase = getSupabaseClient();
	const { data, error } = await supabase.from('courses').select('*');
	if (error) throw error;
	return data;
};
