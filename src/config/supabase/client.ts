// src/config/supabase/client.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
	if (!supabase) {
		const url = process.env.SUPABASE_URL;
		const key = process.env.SUPABASE_ANON_KEY;

		if (!url || !key) {
			throw new Error('Supabase URL or Key is missing. Check your environment variables.');
		}

		supabase = createClient(url, key);
	}
	return supabase;
}
