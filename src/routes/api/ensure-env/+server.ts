import dotenv from 'dotenv';
dotenv.config();
export async function GET() {
	return new Response(
		JSON.stringify({
			SUPABASE_URL: process.env.SUPABASE_URL,
			SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
		}),
		{ status: 200 }
	);
}
