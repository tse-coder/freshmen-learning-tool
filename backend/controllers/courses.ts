import { supabase } from '../supabase/client.ts';

export const getCourses = async () => {
	const { data, error } = await supabase.from('courses').select('*');
	if (error) throw error;
	return data;
};
