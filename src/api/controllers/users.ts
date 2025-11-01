import { getSupabaseClient } from "../../config/supabase/client";

export const getAllUsers = async () => {
    const supabase = getSupabaseClient();
    try {
        const users = await supabase.from('users').select('*');
        return users;
    } catch (error) {
        // Log error in development only
        if (import.meta.env.DEV) {
            console.error('Failed to fetch users:', error);
        }
        throw new Error('Failed to fetch users');
    }
};